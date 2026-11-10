import type { Action } from '../models/dynamic-ui/actions/Action'
import type { ComparableValue } from '../models/dynamic-ui/ComparableValue'
import type { ActionButtonComponent } from '../models/dynamic-ui/pane-components/ActionButtonComponent'
import type { TableComponent } from '../models/dynamic-ui/pane-components/TableComponent'
import type { PaneSection } from '../models/dynamic-ui/PaneSection'
import type { ReportLayout } from '../models/dynamic-ui/ReportLayout'
import type { TableAppearance } from '../models/dynamic-ui/TableAppearance'
import type { TableBorderKind } from '../models/dynamic-ui/TableBorderKind'
import type { TableCell } from '../models/dynamic-ui/TableCell'
import type { TableColumn } from '../models/dynamic-ui/TableColumn'
import type { TableRow } from '../models/dynamic-ui/TableRow'
import type { ReportPaneKind } from '../models/feature/ReportPaneKind'
import type { LinkTarget } from '../reporting-domain/Link/LinkTarget'
import type {
  LegacyCell,
  LegacyColumnDefinition,
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
// The file icons the sites use for these kinds (e.g. Customer.Web's ConversationFileChip)
const RESOURCE_KIND_ICONS: Record<string, Array<string>> = {
  excel: ['fa-duotone', 'fa-file-excel'],
  csv: ['fa-duotone', 'fa-file-csv'],
  pdf: ['fa-duotone', 'fa-file-pdf'],
}

/**
 * Converts a report in the original Vuescape format into a ReportLayout for the given pane.
 *
 * A section becomes a table, or a tab of one when the report has several sections. A single section's title joins the
 * report's title, after a " | ", rather than heading its table. Header rows become the table's header rows, and footer
 * rows its footer rows, and every row's cells span columns as they did; the footers' last rows that each have only one cell are
 * the table's footnotes, shown as text below it. A hidden row is replaced by its child and summary rows,
 * and a shown row's summary rows follow its child rows. A cell's own link becomes a link that dispatches its action: a
 * download, or a navigation whose target names the pane to load the linked report into. A table's borders come from
 * its classes, except that a navigation report's tables have neither stripes nor borders.
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
  const onlySection = report.sections.length === 1 ? report.sections[0] : undefined
  const title = [report.title, onlySection && getSectionTitle(onlySection)]
    .filter(Boolean)
    .join(' | ')

  return {
    id: report.id,
    title: title || undefined,
    targetPane,
    paneWidthPercent,
    reportDetail: report.additionalReportInfo ?? undefined,
    actionButton: toDownloadButton(report),
    content: { id: report.id, sections },
  }
}

function getSectionTitle(section: LegacySection): string | undefined {
  return section.title || section.name || undefined
}

/** A report's only section. Its title is in the report's title (see toReportLayout). */
function toPaneSection(report: LegacyReport, section: LegacySection): PaneSection {
  return { id: `${report.id}-${section.id}`, items: [{ components: [toTable(report, section)] }] }
}

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
                label: getSectionTitle(section) || section.id,
                table: toTable(report, section),
              })),
            },
          },
        ],
      },
    ],
  }
}

function toTable(report: LegacyReport, section: LegacySection): TableComponent {
  const { columnDefinitions, content } = section.treeTable
  const headers = content.headers ?? []
  const columnHeaderRow: LegacyHeaderRow | undefined = headers[headers.length - 1]
  const footers = content.footers ?? []
  const id = `${report.id}-${section.id}`

  const columns = columnDefinitions.map((definition, index): TableColumn => ({
    id: toColumnId(index),
    isSortable: columnHeaderRow?.cells[index]?.columnSorter != null,
    isFrozen: definition.isFrozen,
    style: { '--vuescape-table-cell-max-width': toCellMaxWidth(definition) },
  }))
  const columnCount = columns.length

  // A header row with nothing to show is left out, e.g. a list of links' empty column headings
  const headerRows = headers.flatMap((header, index) =>
    isBlank(header)
      ? []
      : [
          toSpanningRow(header.cells, `${id}-header-${index}`, columnCount, (cell) => ({
            displayValue: cell.displayValue ?? undefined,
          })),
        ],
  )

  // The footers' last rows that each have only one cell, spanning every column, are footnotes, shown as text below the
  // table rather than staying in place with the footer rows; a blank one only spaces them out. The rows before them
  // stay in the table, e.g. totals, leaving out blank ones, so a one-cell row heading other rows stays with them.
  let footnoteStart = footers.length
  while (footnoteStart > 0 && isFullWidth(footers[footnoteStart - 1], columnCount)) {
    footnoteStart--
  }
  const footerRows = footers.slice(0, footnoteStart).flatMap((footer, index) => {
    const rowId = `${id}-footer-${index}`
    return isBlank(footer)
      ? []
      : [
          toSpanningRow(footer.cells, rowId, columnCount, (cell, cellIndex) =>
            toTableCell(cell, `${rowId}-${cellIndex}`),
          ),
        ]
  })
  const footnotes = footers
    .slice(footnoteStart)
    .flatMap((footer) => footer.cells.filter((cell) => isShown(cell) && cell.displayValue))
    .map((cell) => cell.displayValue!)

  return {
    typeName: 'component.table',
    payload: {
      id,
      columns,
      headerRows,
      rows: toTableRows(content.rows ?? [], `${id}-row`, columnCount),
      ...(footerRows.length ? { footerRows } : {}),
      ...(footnotes.length ? { footnotes } : {}),
      ...toAppearance(report, content.cssClass),
    },
  }
}

/** The classes vuescape-dotnet puts beside 'cell-border' (a line around every cell) for other borders */
const CSS_CLASS_BORDERS: ReadonlyArray<[string, TableBorderKind]> = [
  ['no-border', 'none'],
  ['row-border', 'rows'],
]

/**
 * The table's borders come from its classes, a line around every cell unless they say otherwise. A navigation report
 * (its id ends in "navigation", as the original table tells them apart) is a list of links read down rather than
 * across, so it has neither stripes nor borders.
 */
function toAppearance(
  report: LegacyReport,
  cssClass: string | null | undefined,
): { appearance?: TableAppearance } {
  if (report.id.toLowerCase().endsWith('navigation')) {
    return { appearance: { isStriped: false, borders: 'none' } }
  }
  const classes = cssClass?.split(/\s+/) ?? []
  const borders = CSS_CLASS_BORDERS.find(([name]) => classes.includes(name))?.[1]
  return borders ? { appearance: { borders } } : {}
}

/** A header or footer row: a cell spans its columns, and the row leaves out the cells it covers */
function toSpanningRow<T extends LegacyCell | LegacyHeaderCell>(
  cells: Array<T>,
  id: string,
  columnCount: number,
  toCell: (cell: T, index: number) => TableCell,
): TableRow {
  const result: Record<string, TableCell> = {}
  cells.slice(0, columnCount).forEach((cell, index) => {
    if (isShown(cell)) {
      const colspan = cell.colspan!
      result[toColumnId(index)] = { ...toCell(cell, index), ...(colspan > 1 ? { colspan } : {}) }
    }
  })
  return { id, cells: result }
}

function isFullWidth(row: LegacyRow, columnCount: number): boolean {
  const shownCells = row.cells.filter(isShown)
  return shownCells.length === 1 && shownCells[0].colspan! >= columnCount
}

/**
 * A row's children are followed by its summary rows (e.g. totals), shown while it is expanded, as the original table
 * did. A row with no children shows none of its summary rows, and a row's collapsed summary rows aren't shown.
 */
function toTableRows(
  rows: Array<LegacyRow>,
  idPrefix: string,
  columnCount: number,
): Array<TableRow> {
  return rows.flatMap((row, index) => {
    const id = `${idPrefix}-${index}`
    const children = toTableRows(row.children ?? [], id, columnCount)
    const summaryRows = (row.expandedSummaryRows ?? []).map((summaryRow, summaryIndex) =>
      toTableRow(summaryRow, `${id}-summary-${summaryIndex}`, columnCount),
    )
    // A hidden row, e.g. the one a Who Is In report puts its organizations and totals under, is replaced by them
    if (row.isVisible === false) {
      return [...children, ...summaryRows]
    }
    const result = toTableRow(row, id, columnCount)
    if (children.length) {
      result.childRows = [...children, ...summaryRows]
      result.isExpanded = row.isExpanded ?? false
    }
    return [result]
  })
}

/**
 * A body row, with a cell in every column: a cell spans its columns, and a column covered by another cell's span gets an
 * empty cell, which the table hides
 */
function toTableRow(row: LegacyRow, id: string, columnCount: number): TableRow {
  const cells: Record<string, TableCell> = {}
  for (let index = 0; index < columnCount; index++) {
    const cell = row.cells[index]
    const colspan = cell?.colspan ?? 1
    cells[toColumnId(index)] =
      cell && isShown(cell)
        ? { ...toTableCell(cell, `${id}-${index}`), ...(colspan > 1 ? { colspan } : {}) }
        : {}
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
  const classes = cell.cssClasses?.split(/\s+/) ?? []
  if (format?.isBold || classes.includes('font-weight__bold')) {
    result.fontWeight = 'bold'
  }
  if (format?.isItalic || classes.includes('font-style__italic')) {
    result.fontStyle = 'italic'
  }
  if (format?.isUnderlined || classes.includes('text-decoration__underline')) {
    result.textDecoration = 'underline'
  }
  return Object.keys(result).length ? result : undefined
}

/**
 * As the original table did, a column given a width cuts its text off there, and any other column sizes to its
 * content, so text whose end matters (e.g. an id) isn't cut off at the table's default max width.
 */
function toCellMaxWidth(definition: LegacyColumnDefinition): string {
  return definition.columnWidthBehavior === 'useSpecifiedWidth' && definition.width != null
    ? `${definition.width}px`
    : 'none'
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
      // The caret says the button opens a menu
      icons: ['fa-solid', 'fa-caret-down'],
      iconPosition: 'right',
      menuItems: links.map((link) => ({
        label: link.title || RESOURCE_KIND_LABELS[link.resourceKind] || link.resourceKind,
        action: { typeName: 'action.download', payload: { url: link.source } },
        icons: RESOURCE_KIND_ICONS[link.resourceKind],
        iconPosition: 'left',
        isDisabled: false,
      })),
    },
  }
}

/**
 * A cell covered by an earlier cell's span has no colspan. It is still marked visible: the original table renders it,
 * hidden by a CSS class, to size the span.
 */
function isShown(cell: LegacyCell | LegacyHeaderCell): boolean {
  return cell.isVisible && cell.colspan != null
}

function isBlank(row: LegacyRow | LegacyHeaderRow): boolean {
  return row.cells.every((cell) => !isShown(cell) || !cell.displayValue)
}

function toColumnId(index: number): string {
  return `c${index}`
}
