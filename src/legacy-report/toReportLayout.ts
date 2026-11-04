import type { Action } from '../models/dynamic-ui/actions/Action'
import type { ComparableValue } from '../models/dynamic-ui/ComparableValue'
import type { ActionButtonComponent } from '../models/dynamic-ui/pane-components/ActionButtonComponent'
import type { PaneComponent } from '../models/dynamic-ui/pane-components/PaneComponent'
import type { TableComponent } from '../models/dynamic-ui/pane-components/TableComponent'
import type { TextComponent } from '../models/dynamic-ui/pane-components/TextComponent'
import type { PaneSection } from '../models/dynamic-ui/PaneSection'
import type { RenderTextAs } from '../models/dynamic-ui/RenderTextAs'
import type { ReportLayout } from '../models/dynamic-ui/ReportLayout'
import type { TableCell } from '../models/dynamic-ui/TableCell'
import type { TableColumn } from '../models/dynamic-ui/TableColumn'
import type { TableRow } from '../models/dynamic-ui/TableRow'
import type { ReportPaneKind } from '../models/feature/ReportPaneKind'
import type { LinkTarget } from '../reporting-domain/Link/LinkTarget'
import type {
  LegacyCell,
  LegacyHeaderCell,
  LegacyHeaderRow,
  LegacyLink,
  LegacyReport,
  LegacyRow,
  LegacySection,
} from './LegacyReport'

/** The name of a cell's own link, the one followed when the cell is clicked */
const SELF_LINK_NAME = '__vs-self'

const NUMERIC_UI_OBJECT_TYPES = new Set(['int', 'short', 'long', 'decimal'])

const RESOURCE_KIND_LABELS: Record<string, string> = { excel: 'Excel', csv: 'CSV', pdf: 'PDF' }

/**
 * Converts a report in the original Vuescape format into a ReportLayout for the given pane.
 *
 * A section becomes a table, or a tab of one when the report has several sections. Header rows above the column
 * headers and footer rows spanning every column (e.g. a footnote) become text above and below a single section's table;
 * other footer rows become the table's footer rows. A row with nothing to show that only groups child rows is replaced
 * by them. A cell's own link becomes a link that dispatches its action: a download, or a navigation whose target names
 * the pane to load the linked report into.
 */
export function toReportLayout(
  report: LegacyReport,
  targetPane: ReportPaneKind,
  paneWidthPercent = 100,
): ReportLayout {
  const sections =
    report.sections.length > 1
      ? [toTabbedSection(report)]
      : report.sections.map((section) => toPaneSection(report, section))

  return {
    id: report.id,
    title: report.title ?? undefined,
    targetPane,
    paneWidthPercent,
    reportDetail: report.additionalReportInfo ?? undefined,
    actionButton: toDownloadButton(report),
    content: { id: report.id, sections },
  }
}

function toPaneSection(report: LegacyReport, section: LegacySection): PaneSection {
  const { table, textAbove, textBelow } = toTable(report, section)
  const id = `${report.id}-${section.id}`
  const title = section.title || section.name
  const components: Array<PaneComponent> = [
    ...(title ? [toText(`${id}-title`, title, 'subheading')] : []),
    ...textAbove.map((text, index) => toText(`${id}-above-${index}`, text)),
    table,
    ...textBelow.map((text, index) => toText(`${id}-below-${index}`, text)),
  ]
  return { id, items: [{ components }] }
}

/** A tab holds only a table, so a tabbed section's text above and below its table isn't shown. */
function toTabbedSection(report: LegacyReport): PaneSection {
  const id = `${report.id}-sections`
  return {
    id,
    items: [
      {
        components: [
          {
            typeName: 'component.tableTabs',
            payload: {
              id,
              tabs: report.sections.map((section) => ({
                id: section.id,
                label: section.title || section.name || section.id,
                table: toTable(report, section).table,
              })),
            },
          },
        ],
      },
    ],
  }
}

function toTable(
  report: LegacyReport,
  section: LegacySection,
): { table: TableComponent; textAbove: Array<string>; textBelow: Array<string> } {
  const { columnDefinitions, content } = section.treeTable
  const headers = content.headers ?? []
  const columnHeaderRow: LegacyHeaderRow | undefined = headers[headers.length - 1]
  const id = `${report.id}-${section.id}`

  const columns = columnDefinitions.map((definition, index): TableColumn => {
    const headerCell = columnHeaderRow?.cells[index]
    return {
      id: toColumnId(index),
      headerText: headerCell?.displayValue ?? undefined,
      isSortable: headerCell?.columnSorter != null,
      isFrozen: definition.isFrozen,
    }
  })

  const textBelow: Array<string> = []
  const footerRows: Array<TableRow> = []
  ;(content.footers ?? []).forEach((footer, index) => {
    const shownCells = footer.cells.filter(isShown)
    if (shownCells.length === 1 && shownCells[0].colspan! >= columns.length) {
      // Spans every column, e.g. a footnote, or a blank row spacing one out
      if (shownCells[0].displayValue) {
        textBelow.push(shownCells[0].displayValue)
      }
    } else if (!isBlank(footer)) {
      footerRows.push(toTableRow(footer, `${id}-footer-${index}`, columns.length))
    }
  })

  return {
    table: {
      typeName: 'component.table',
      payload: {
        id,
        columns,
        rows: toTableRows(content.rows ?? [], `${id}-row`, columns.length),
        ...(footerRows.length ? { footerRows } : {}),
      },
    },
    textAbove: headers
      .slice(0, -1)
      .map((header) =>
        header.cells
          .filter((cell) => isShown(cell) && cell.displayValue)
          .map((cell) => cell.displayValue)
          .join(' '),
      )
      .filter((text) => text),
    textBelow,
  }
}

function toTableRows(
  rows: Array<LegacyRow>,
  idPrefix: string,
  columnCount: number,
): Array<TableRow> {
  return rows.flatMap((row, index) => {
    const id = `${idPrefix}-${index}`
    const children = row.children ?? []
    // A row shown only to group its children, e.g. the organizations of a Who Is In report
    if (children.length && isBlank(row)) {
      return toTableRows(children, id, columnCount)
    }
    const result = toTableRow(row, id, columnCount)
    if (children.length) {
      result.childRows = toTableRows(children, id, columnCount)
      result.isExpanded = row.isExpanded ?? false
    }
    return [result]
  })
}

/** Gives every column a cell, as the table expects; a column covered by another cell's span gets an empty one */
function toTableRow(row: LegacyRow, id: string, columnCount: number): TableRow {
  const cells: Record<string, TableCell> = {}
  for (let index = 0; index < columnCount; index++) {
    const cell = row.cells[index]
    cells[toColumnId(index)] = cell && isShown(cell) ? toTableCell(cell, `${id}-${index}`) : {}
  }
  return { id, cells }
}

function toTableCell(cell: LegacyCell, id: string): TableCell {
  const displayValue = cell.displayValue ?? undefined
  const link = cell.links?.[SELF_LINK_NAME]
  const cssStyles = toCssStyles(cell)
  const comparableValue = toComparableValue(cell)
  return {
    displayValue,
    ...(link
      ? {
          component: {
            typeName: 'component.textLink',
            payload: { id, text: displayValue ?? '', action: toAction(link) },
          },
        }
      : {}),
    ...(cssStyles ? { cssStyles } : {}),
    ...(comparableValue ? { comparableValue } : {}),
  }
}

function toCssStyles(cell: LegacyCell): Record<string, string> | undefined {
  const format = cell.cellFormat
  const result: Record<string, string> = {}
  if (format?.backgroundHexColor) {
    result.backgroundColor = format.backgroundHexColor
  }
  if (format?.fontHexColor) {
    result.color = format.fontHexColor
  }
  // e.g. '12px'
  if (format?.fontSizeInPixels) {
    result.fontSize = format.fontSizeInPixels
  }
  // The table lays a cell's content out in a row
  if (format?.horizontalAlignment === 'center') {
    result.justifyContent = 'center'
  } else if (format?.horizontalAlignment === 'right') {
    result.justifyContent = 'flex-end'
  }
  return Object.keys(result).length ? result : undefined
}

/** Numbers sort as numbers. The table sorts a column by its comparable values only when every cell has one. */
function toComparableValue(cell: LegacyCell): ComparableValue | undefined {
  const slots = cell.slots
  const uiObject = slots?.slotNameToUiObjectMap[slots.defaultSlotName]
  if (!uiObject) {
    return undefined
  }
  if (
    NUMERIC_UI_OBJECT_TYPES.has(uiObject.uiObjectType ?? '') &&
    typeof uiObject.value === 'number'
  ) {
    return { numericValue: uiObject.value }
  }
  if (uiObject.uiObjectType === 'string' && typeof uiObject.value === 'string') {
    return { stringValue: uiObject.value }
  }
  return undefined
}

function toAction(link: LegacyLink): Action {
  return link.linkTarget === 'download'
    ? { typeName: 'action.download', payload: { url: link.source } }
    : {
        typeName: 'action.navigate',
        payload: { url: link.source, target: link.linkTarget as LinkTarget },
      }
}

function toDownloadButton(report: LegacyReport): ActionButtonComponent | undefined {
  const links = report.downloadLinks ?? []
  if (!links.length) {
    return undefined
  }
  return {
    typeName: 'component.actionButton',
    payload: {
      id: `${report.id}-download`,
      label: 'Download',
      isDisabled: false,
      iconPosition: 'left',
      menuItems: links.map((link) => ({
        label: link.title || RESOURCE_KIND_LABELS[link.resourceKind] || link.resourceKind,
        action: { typeName: 'action.download', payload: { url: link.source } },
        iconPosition: 'left',
        isDisabled: false,
      })),
    },
  }
}

function toText(id: string, text: string, renderTextAs: RenderTextAs = 'paragraph'): TextComponent {
  return { typeName: 'component.text', payload: { id, text, renderTextAs } }
}

/**
 * A cell covered by an earlier cell's span has no colspan. It is still marked visible: the original table renders it,
 * hidden by a CSS class, to size the span.
 */
function isShown(cell: LegacyCell | LegacyHeaderCell): boolean {
  return cell.isVisible && cell.colspan != null
}

function isBlank(row: LegacyRow): boolean {
  return row.cells.every((cell) => !isShown(cell) || !cell.displayValue)
}

function toColumnId(index: number): string {
  return `c${index}`
}
