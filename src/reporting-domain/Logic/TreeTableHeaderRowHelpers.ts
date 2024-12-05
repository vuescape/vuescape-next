import { SortDirection } from '../../reporting-domain/TreeTable/SortDirection'
import { type TreeTableHeaderCell } from '../../reporting-domain/TreeTable/TreeTableHeaderCell'
import { type TreeTableHeaderRow } from '../../reporting-domain/TreeTable/TreeTableHeaderRow'

/**
 * Function to get the sorted header cell with its index.
 * @param headers - An array of TreeTableHeaderRow.
 * @returns An object containing the sorted header cell and its index, or undefined if no headers are provided or no sorted header is found.
 */
export function getSortedHeaderCellWithIndex(headers: Array<TreeTableHeaderRow>) {
  if (!headers || !headers.length) {
    return
  }

  const row = headers[headers.length - 1]
  const sortHeader = row.cells
    .map((cell: TreeTableHeaderCell, index: number) => {
      const result = {
        cell,
        index
      }
      return result
    })
    .filter(
      (_: { index: number; cell: TreeTableHeaderCell }) =>
        _.cell.columnSorter && _.cell.columnSorter.sortDirection !== SortDirection.None
    )

  return sortHeader[0]
}
