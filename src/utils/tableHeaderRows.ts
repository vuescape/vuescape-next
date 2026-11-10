import type { TableCell } from '../models/dynamic-ui/TableCell'
import type { TableColumn } from '../models/dynamic-ui/TableColumn'
import type { TableRow } from '../models/dynamic-ui/TableRow'

/**
 * A row's cell where it shows: under the column it starts at, across `colspan` columns.
 */
export interface SpannedCell {
  column: TableColumn
  cell: TableCell
  colspan: number
}

/**
 * Lays a row's cells out across the columns. A cell spans its colspan columns from its own, and the
 * cells of the columns it covers are skipped. A column with no cell, and not covered, gets an empty one. A span is cut
 * short at the last column.
 */
export function getSpannedCells(row: TableRow, columns: Array<TableColumn>): Array<SpannedCell> {
  const result: Array<SpannedCell> = []
  let coveredCount = 0
  columns.forEach((column, index) => {
    if (coveredCount > 0) {
      coveredCount--
      return
    }

    const cell = row.cells[column.id] ?? {}
    const colspan = Math.min(Math.max(1, cell.colspan ?? 1), columns.length - index)
    coveredCount = colspan - 1
    result.push({ column, cell, colspan })
  })
  return result
}

/** Hides a body row's cell in a column another cell's span covers */
export const COVERED_BODY_CELL_CLASS = 'vuescape-table__covered-cell'

/**
 * The attributes of a body row's cell in a column, laid out as getSpannedCells lays out a header or footer row: a cell
 * spanning columns gets its colspan, and a cell in a column it covers is hidden. The table renders a cell in every column
 * of a body row, so a covered cell is hidden rather than left out, which also keeps a cell per column for the frozen
 * cells' offsets. A span shouldn't cross the frozen columns' edge: the cell is frozen when its first column is.
 */
export function getBodyCellAttributes(
  row: TableRow,
  columns: Array<TableColumn>,
  columnId: string,
): { colspan?: number; class?: string } {
  const spannedCell = getSpannedCells(row, columns).find(
    (spanned) => spanned.column.id === columnId,
  )
  if (!spannedCell) {
    return { class: COVERED_BODY_CELL_CLASS }
  }
  return spannedCell.colspan > 1 ? { colspan: spannedCell.colspan } : {}
}

/**
 * The table's header rows: its own, or, when it has none, one row of the columns' deprecated header text. No column
 * having any header text means no header.
 */
export function getHeaderRows(
  headerRows: Array<TableRow> | null | undefined,
  columns: Array<TableColumn>,
): Array<TableRow> {
  if (headerRows) {
    return headerRows
  }

  if (!columns.some((column) => column.headerText)) {
    return []
  }

  return [
    {
      id: 'header',
      cells: Object.fromEntries(
        columns.map((column) => [column.id, { displayValue: column.headerText }]),
      ),
    },
  ]
}
