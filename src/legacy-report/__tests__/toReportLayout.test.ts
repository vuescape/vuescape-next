import { describe, expect, it } from 'vitest'

import type { PaneComponent } from '../../models/dynamic-ui/pane-components/PaneComponent'
import type { TableComponent } from '../../models/dynamic-ui/pane-components/TableComponent'
import type { ReportLayout } from '../../models/dynamic-ui/ReportLayout'
import { ReportPaneKind } from '../../models/feature/ReportPaneKind'
import type {
  LegacyCell,
  LegacyHeaderCell,
  LegacyReport,
  LegacyRow,
  LegacySection,
} from '../LegacyReport'
import { toReportLayout } from '../toReportLayout'

function cell(displayValue?: string, extra: Partial<LegacyCell> = {}): LegacyCell {
  return { displayValue, colspan: 1, isVisible: true, links: {}, ...extra }
}

function valueCell(value: string | number, uiObjectType: string): LegacyCell {
  return cell(String(value), {
    slots: {
      slotNameToUiObjectMap: { '__vs-value': { value, uiObjectType } },
      defaultSlotName: '__vs-value',
    },
  })
}

/** A column that sizes to its content, as vuescape-dotnet's columns do unless given a width */
const noMaxWidth = { '--vuescape-table-cell-max-width': 'none' }

/** A cell covered by an earlier cell's span, as vuescape-dotnet makes it: visible, without a colspan */
const covered: LegacyCell = { isVisible: true }

function headerCell(displayValue: string | undefined, isSortable = false): LegacyHeaderCell {
  return {
    displayValue,
    colspan: 1,
    isVisible: true,
    ...(isSortable ? { columnSorter: { sortDirection: 'none' } } : {}),
  }
}

function row(cells: Array<LegacyCell>, children?: Array<LegacyRow>, isExpanded = false): LegacyRow {
  return { cells, children, isExpanded }
}

function section(
  id: string,
  content: LegacySection['treeTable']['content'],
  extra: Partial<LegacySection> = {},
): LegacySection {
  return {
    id,
    treeTable: {
      columnDefinitions: [
        { columnWidthBehavior: 'dynamicallySizeToContent', isFrozen: true },
        { columnWidthBehavior: 'dynamicallySizeToContent', isFrozen: false },
      ],
      content,
    },
    ...extra,
  }
}

function report(sections: Array<LegacySection>, extra: Partial<LegacyReport> = {}): LegacyReport {
  return { id: 'report', title: 'Report Title', sections, ...extra }
}

const columnHeaders = { cells: [headerCell('Name', true), headerCell('Count')] }

function getComponents(layout: ReportLayout): Array<PaneComponent> {
  return layout.content!.sections.flatMap((paneSection) =>
    paneSection.items.flatMap((item) => item.components),
  )
}

function getTable(layout: ReportLayout): TableComponent {
  return getComponents(layout).find(
    (component): component is TableComponent => component.typeName === 'component.table',
  )!
}

describe('toReportLayout', () => {
  it(`should put a section's table in the pane, with the section's title after the report's`, () => {
    // Arrange
    const legacyReport = report([
      section(
        'running',
        {
          headers: [columnHeaders],
          rows: [row([valueCell('Org A', 'string'), valueCell(3, 'int')])],
        },
        { title: 'Running' },
      ),
    ])

    // Act
    const actual = toReportLayout(legacyReport, ReportPaneKind.LeftPane, 20)

    // Assert
    expect(actual).toMatchObject({
      id: 'report',
      title: 'Report Title | Running',
      targetPane: ReportPaneKind.LeftPane,
      paneWidthPercent: 20,
    })
    expect(getComponents(actual).map((component) => component.typeName)).toEqual([
      'component.table',
    ])
    expect(getTable(actual).payload).toEqual({
      id: 'report-running',
      columns: [
        { id: 'c0', isSortable: true, isFrozen: true, style: noMaxWidth },
        { id: 'c1', isSortable: false, isFrozen: false, style: noMaxWidth },
      ],
      headerRows: [
        {
          id: 'report-running-header-0',
          cells: { c0: { displayValue: 'Name' }, c1: { displayValue: 'Count' } },
        },
      ],
      rows: [
        {
          id: 'report-running-row-0',
          cells: {
            c0: { displayValue: 'Org A', comparableValue: { stringValue: 'Org A' } },
            c1: { displayValue: '3', comparableValue: { numericValue: 3 } },
          },
        },
      ],
    })
  })

  it('should leave the header text out when the table has no header rows', () => {
    // Act
    const actual = toReportLayout(
      report([section('navigation', { rows: [row([cell('Org A'), cell()])] })]),
      ReportPaneKind.LeftPane,
    )

    // Assert
    expect(getTable(actual).payload.columns).toEqual([
      { id: 'c0', headerText: undefined, isSortable: false, isFrozen: true, style: noMaxWidth },
      { id: 'c1', headerText: undefined, isSortable: false, isFrozen: false, style: noMaxWidth },
    ])
  })

  it('should cut a column off at its width only when it is given one', () => {
    // Arrange
    const legacySection = section('running', { rows: [row([cell('6610458'), cell('stats_1')])] })
    legacySection.treeTable.columnDefinitions = [
      { columnWidthBehavior: 'useSpecifiedWidth', width: 120, isFrozen: false },
      { columnWidthBehavior: 'dynamicallySizeToContent', width: null, isFrozen: false },
    ]

    // Act
    const actual = toReportLayout(report([legacySection]), ReportPaneKind.CenterPane)

    // Assert
    expect(getTable(actual).payload.columns.map((column) => column.style)).toEqual([
      { '--vuescape-table-cell-max-width': '120px' },
      noMaxWidth,
    ])
  })

  it(`should style a cell as its format says`, () => {
    // Arrange
    const formatted = cell('in', {
      cellFormat: {
        backgroundHexColor: '#90EE90',
        fontHexColor: '#000000',
        fontSizeInPixels: '12px',
        horizontalAlignment: 'right',
      },
    })

    // Act
    const actual = toReportLayout(
      report([
        section('section', { headers: [columnHeaders], rows: [row([cell('Org A'), formatted])] }),
      ]),
      ReportPaneKind.CenterPane,
    )

    // Assert
    expect(getTable(actual).payload.rows[0].cells.c1.cssStyles).toEqual({
      backgroundColor: '#90EE90',
      color: '#000000',
      fontSize: '12px',
      justifyContent: 'flex-end',
    })
  })

  it('should show the children and summary rows of a hidden row in its place', () => {
    // Arrange
    // As vuescape-dotnet makes a Who Is In report's row when the table has another
    const hiddenRow: LegacyRow = {
      ...row(
        [cell(), cell()],
        [row([cell('Org A'), cell('in')]), row([cell('Org B'), cell()])],
        true,
      ),
      isVisible: false,
      expandedSummaryRows: [row([cell('Total In'), cell('1')])],
    }
    const parentRow = row([cell('Org C'), cell()], [row([cell('Org C1'), cell()])], true)

    // Act
    const actual = toReportLayout(
      report([section('section', { headers: [columnHeaders], rows: [hiddenRow, parentRow] })]),
      ReportPaneKind.CenterPane,
    )

    // Assert
    const rows = getTable(actual).payload.rows
    expect(rows.map((tableRow) => [tableRow.id, tableRow.cells.c0.displayValue])).toEqual([
      ['report-section-row-0-0', 'Org A'],
      ['report-section-row-0-1', 'Org B'],
      ['report-section-row-0-summary-0', 'Total In'],
      ['report-section-row-1', 'Org C'],
    ])
    expect(rows[2].cells.c1).toEqual({ displayValue: '1' })
    expect(rows[3].isExpanded).toBe(true)
    expect(rows[3].childRows?.map((tableRow) => tableRow.cells.c0.displayValue)).toEqual(['Org C1'])
  })

  it(`should keep a shown row with nothing in it, as the original table did`, () => {
    // Act
    const actual = toReportLayout(
      report([
        section('section', {
          headers: [columnHeaders],
          rows: [row([cell(), cell()], [row([cell('Org A'), cell()])])],
        }),
      ]),
      ReportPaneKind.CenterPane,
    )

    // Assert
    const rows = getTable(actual).payload.rows
    expect(rows).toHaveLength(1)
    expect(rows[0].childRows?.map((tableRow) => tableRow.cells.c0.displayValue)).toEqual(['Org A'])
  })

  it(`should show a shown row's summary rows after its children, and none without children`, () => {
    // Arrange
    const parentRow: LegacyRow = {
      ...row([cell('Region'), cell('2')], [row([cell('Org A'), cell('1')])]),
      expandedSummaryRows: [row([cell('Region Total'), cell('2')])],
    }
    const childlessRow: LegacyRow = {
      ...row([cell('Org B'), cell('1')]),
      expandedSummaryRows: [row([cell('Org B Total'), cell('1')])],
    }

    // Act
    const actual = toReportLayout(
      report([section('section', { headers: [columnHeaders], rows: [parentRow, childlessRow] })]),
      ReportPaneKind.CenterPane,
    )

    // Assert
    const rows = getTable(actual).payload.rows
    expect(rows[0].isExpanded).toBe(false)
    expect(
      rows[0].childRows?.map((tableRow) => [tableRow.id, tableRow.cells.c0.displayValue]),
    ).toEqual([
      ['report-section-row-0-0', 'Org A'],
      ['report-section-row-0-summary-0', 'Region Total'],
    ])
    expect(rows[1].childRows).toBeUndefined()
  })

  it('should keep header rows and totals in the table, and show the last full-width footer rows as footnotes', () => {
    // Arrange
    const legacyReport = report([
      section('section', {
        headers: [
          { cells: [headerCell('Total Active Organizations: 2'), headerCell(undefined)] },
          columnHeaders,
        ],
        rows: [row([cell('Org A'), cell('in')])],
        footers: [
          row([cell('Total In'), cell('1')]),
          row([cell(undefined, { colspan: 2 }), covered]),
          row([cell('* A footnote', { colspan: 2 }), covered]),
        ],
      }),
    ])

    // Act
    const actual = toReportLayout(legacyReport, ReportPaneKind.CenterPane)

    // Assert
    const components = getComponents(actual)
    expect(components.map((component) => component.typeName)).toEqual([
      'component.table',
      'component.text',
    ])
    expect(components[1].payload).toMatchObject({ text: '* A footnote' })
    expect(getTable(actual).payload.headerRows).toEqual([
      {
        id: 'report-section-header-0',
        cells: { c0: { displayValue: 'Total Active Organizations: 2' }, c1: {} },
      },
      {
        id: 'report-section-header-1',
        cells: { c0: { displayValue: 'Name' }, c1: { displayValue: 'Count' } },
      },
    ])
    expect(getTable(actual).payload.footerRows).toEqual([
      {
        id: 'report-section-footer-0',
        cells: { c0: { displayValue: 'Total In' }, c1: { displayValue: '1' } },
      },
    ])
  })

  it('should keep a full-width footer row followed by other footer rows in the table, spanning its columns', () => {
    // Act
    const actual = toReportLayout(
      report([
        section('section', {
          headers: [columnHeaders],
          rows: [],
          footers: [
            row([cell('Totals', { colspan: 2 }), covered]),
            row([cell('Total In'), cell('1')]),
          ],
        }),
      ]),
      ReportPaneKind.CenterPane,
    )

    // Assert
    expect(getComponents(actual).map((component) => component.typeName)).toEqual([
      'component.table',
    ])
    expect(getTable(actual).payload.footerRows?.map((footerRow) => footerRow.cells)).toEqual([
      { c0: { displayValue: 'Totals', colspan: 2 } },
      { c0: { displayValue: 'Total In' }, c1: { displayValue: '1' } },
    ])
  })

  it('should leave out a header row with nothing to show, e.g. a list of links', () => {
    // Act
    const actual = toReportLayout(
      report([
        section('section', {
          headers: [{ cells: [headerCell(''), headerCell(undefined)] }],
          rows: [row([cell('Org A'), cell('in')])],
        }),
      ]),
      ReportPaneKind.LeftPane,
    )

    // Assert
    expect(getTable(actual).payload.headerRows).toEqual([])
  })

  it(`should give a column covered by another cell's span an empty cell`, () => {
    // Act
    const actual = toReportLayout(
      report([
        section('section', {
          headers: [columnHeaders],
          rows: [row([cell('Org A', { colspan: 2 }), covered])],
        }),
      ]),
      ReportPaneKind.CenterPane,
    )

    // Assert
    expect(getTable(actual).payload.rows[0].cells).toEqual({
      c0: { displayValue: 'Org A' },
      c1: {},
    })
  })

  it(`should make a cell's link load the linked report into the pane it names, or download it`, () => {
    // Arrange
    const reportLink = cell('Org A', {
      links: {
        '__vs-self': {
          source: 'https://api/report-a',
          linkTarget: 'centerPane',
          resourceKind: 'report',
        },
      },
    })
    const downloadLink = cell('Export', {
      links: {
        '__vs-self': {
          source: 'https://api/export',
          linkTarget: 'download',
          resourceKind: 'excel',
        },
      },
    })

    // Act
    const actual = toReportLayout(
      report([section('section', { rows: [row([reportLink, downloadLink])] })]),
      ReportPaneKind.LeftPane,
    )

    // Assert
    const cells = getTable(actual).payload.rows[0].cells
    expect(cells.c0.component).toEqual({
      typeName: 'component.textLink',
      payload: {
        id: 'report-section-row-0-0',
        text: 'Org A',
        action: {
          typeName: 'action.navigate',
          payload: { url: 'https://api/report-a', target: 'centerPane' },
        },
      },
    })
    expect(cells.c1.component?.payload).toMatchObject({
      action: { typeName: 'action.download', payload: { url: 'https://api/export' } },
    })
  })

  it('should show several sections as tabs', () => {
    // Arrange
    const legacyReport = report([
      section('running', { headers: [columnHeaders], rows: [] }, { title: 'Running' }),
      section(
        'completed',
        { headers: [columnHeaders], rows: [row([cell('Job'), cell('1')])] },
        { name: 'Completed' },
      ),
    ])

    // Act
    const actual = toReportLayout(legacyReport, ReportPaneKind.CenterPane)

    // Assert
    const components = getComponents(actual)
    expect(components).toHaveLength(1)
    expect(components[0].typeName).toBe('component.tableTabs')
    expect(
      (
        components[0].payload as {
          tabs: Array<{ id: string; label: string; table?: TableComponent }>
        }
      ).tabs.map((tab) => [tab.id, tab.label, tab.table?.payload.id]),
    ).toEqual([
      ['running', 'Running', 'report-running'],
      ['completed', 'Completed', 'report-completed'],
    ])
  })

  it(`should offer the report's downloads from a button and show its additional info`, () => {
    // Arrange
    const legacyReport = report([section('section', { rows: [] })], {
      additionalReportInfo: 'As Of: Wednesday, November, 4, 2026',
      downloadLinks: [
        {
          source: 'https://api/report?ResourceKind=Excel',
          linkTarget: 'download',
          resourceKind: 'excel',
        },
      ],
    })

    // Act
    const actual = toReportLayout(legacyReport, ReportPaneKind.CenterPane)

    // Assert
    expect(actual.reportDetail).toBe('As Of: Wednesday, November, 4, 2026')
    expect(actual.actionButton?.payload).toMatchObject({
      label: 'Download',
      icons: ['fa-solid', 'fa-caret-down'],
      iconPosition: 'right',
    })
    expect(actual.actionButton?.payload.menuItems).toEqual([
      {
        label: 'Excel',
        action: {
          typeName: 'action.download',
          payload: { url: 'https://api/report?ResourceKind=Excel' },
        },
        icons: ['fa-duotone', 'fa-file-excel'],
        iconPosition: 'left',
        isDisabled: false,
      },
    ])
  })
})
