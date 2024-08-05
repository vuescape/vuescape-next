import { type ColumnSorter, type TreeTableCell } from '@/reporting-domain'

/**
 * Interface representing a TreeTableHeaderCell.
 * It extends from TreeTableCell and includes an optional columnSorter.
 */
export interface TreeTableHeaderCell extends TreeTableCell {
  /** The column sorter of the TreeTableHeaderCell. */
  columnSorter?: ColumnSorter
}
