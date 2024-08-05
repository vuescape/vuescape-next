import { SortComparisonStrategy } from '@/infrastructure'
import { SortDirection } from './SortDirection'

/**
 * Interface representing a ColumnSorter.
 */
export interface ColumnSorter {
  /** The direction of the sort. */
  sortDirection: SortDirection

  /** The strategy used for comparison during sorting. Optional. */
  sortComparisonStrategy?: SortComparisonStrategy
}
