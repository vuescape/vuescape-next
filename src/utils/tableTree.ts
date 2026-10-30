import type { TableRow } from '../models/dynamic-ui/TableRow'

/**
 * A row as a tree table shows it: where it sits in the tree and whether its child rows are showing.
 */
export interface VisibleTableRow extends TableRow {
  /** How many ancestors the row has. Top-level rows are 0. */
  depth: number
  /** Whether the row has child rows, and so a toggle. */
  hasChildRows: boolean
  /** Whether the row's child rows are showing. */
  isExpanded: boolean
}

function getChildRows(row: TableRow): Array<TableRow> {
  return row.childRows ?? []
}

/**
 * Whether the rows form a tree, i.e. any of them has child rows. Child rows can only exist under top-level rows,
 * so only those are checked.
 */
export function isTree(rows: ReadonlyArray<TableRow>): boolean {
  return rows.some((row) => getChildRows(row).length > 0)
}

/**
 * Every row in the tree, parents before their children.
 */
export function getAllRows(rows: ReadonlyArray<TableRow>): Array<TableRow> {
  return rows.flatMap((row) => [row, ...getAllRows(getChildRows(row))])
}

/**
 * The ids of the rows that start expanded.
 */
export function getInitiallyExpandedRowIds(rows: ReadonlyArray<TableRow>): Set<string> {
  return new Set(
    getAllRows(rows)
      .filter((row) => row.isExpanded === true && getChildRows(row).length > 0)
      .map((row) => row.id),
  )
}

/**
 * The rows to show, parents before their children, with the children of collapsed rows left out.
 *
 * @param rows - The top-level rows.
 * @param expandedRowIds - The ids of the rows whose child rows are showing.
 */
export function flattenVisibleRows(
  rows: ReadonlyArray<TableRow>,
  expandedRowIds: ReadonlySet<string>,
  depth = 0,
): Array<VisibleTableRow> {
  return rows.flatMap((row) => {
    const childRows = getChildRows(row)
    const isExpanded = childRows.length > 0 && expandedRowIds.has(row.id)
    const visibleRow: VisibleTableRow = {
      ...row,
      depth,
      hasChildRows: childRows.length > 0,
      isExpanded,
    }

    return isExpanded
      ? [visibleRow, ...flattenVisibleRows(childRows, expandedRowIds, depth + 1)]
      : [visibleRow]
  })
}

/**
 * Sorts each row's child rows, and the top-level rows, among themselves, so child rows stay under their parent.
 * The sort is stable and the rows are not changed.
 *
 * @param rows - The top-level rows.
 * @param getSortValue - The value of a row to sort by.
 * @param sortOrder - 1 for ascending, -1 for descending.
 */
export function sortTree(
  rows: ReadonlyArray<TableRow>,
  getSortValue: (row: TableRow) => unknown,
  sortOrder: number,
): Array<TableRow> {
  return [...rows]
    .sort((row1, row2) => compareSortValues(getSortValue(row1), getSortValue(row2), sortOrder))
    .map((row) =>
      row.childRows?.length
        ? { ...row, childRows: sortTree(row.childRows, getSortValue, sortOrder) }
        : row,
    )
}

const collator = new Intl.Collator(undefined, { numeric: true })

function isEmptySortValue(value: unknown): boolean {
  return value == null || value === ''
}

/**
 * Compares two values the way PrimeVue's DataTable sorts a flat table (`sort` in `@primeuix/utils/object`), so a
 * column sorts the same whether or not its table is a tree: strings by locale with numeric runs compared as
 * numbers, other values with `<`, and empty values (null, undefined, '') last in either direction.
 *
 * @returns A negative number when value1 sorts first, positive when value2 does, 0 when they are equal.
 */
export function compareSortValues(value1: unknown, value2: unknown, sortOrder: number): number {
  const isEmpty1 = isEmptySortValue(value1)
  const isEmpty2 = isEmptySortValue(value2)
  if (isEmpty1 || isEmpty2) {
    return isEmpty1 === isEmpty2 ? 0 : isEmpty1 ? 1 : -1
  }

  if (typeof value1 === 'string' && typeof value2 === 'string') {
    return collator.compare(value1, value2) * sortOrder
  }

  const result =
    (value1 as number) < (value2 as number) ? -1 : (value1 as number) > (value2 as number) ? 1 : 0
  return result * sortOrder
}

/**
 * Reads a dot-separated path, e.g. `cells.name.displayValue`, the form a DataTable column's `sortField` takes.
 */
export function resolveFieldPath(value: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (current, key) => (current == null ? undefined : (current as Record<string, unknown>)[key]),
      value,
    )
}
