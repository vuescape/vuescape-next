import { SortDirection } from './SortDirection'

import { SortComparisonStrategy } from '@vuescape/infrastructure'

export interface ColumnSorter {
  sortDirection: SortDirection
  sortComparisonStrategy?: SortComparisonStrategy
}
