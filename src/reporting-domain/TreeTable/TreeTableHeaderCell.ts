import { type ColumnSorter, type TreeTableCell } from '@vuescape/reporting-domain'

export interface TreeTableHeaderCell extends TreeTableCell {
  columnSorter?: ColumnSorter
}
