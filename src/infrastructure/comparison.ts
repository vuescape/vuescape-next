import { SortComparisonStrategy } from './SortComparisonStrategy'

/**
 * Creates a property comparer function based on the provided sort property and comparison strategy.
 * The created function can be used to compare two objects based on the specified property.
 * The comparison is done in different ways depending on the provided comparison strategy.
 * If no comparison strategy is provided, the default strategy is used.
 *
 * @param sortOnProperty - The property to sort on.
 * @param [sortComparisonStrategy=SortComparisonStrategy.Default] - The comparison strategy to use.
 * @returns A comparer function.
 * @throws If an unsupported comparison strategy is provided.
 */
export function makePropertyComparer(sortOnProperty: string,
  sortComparisonStrategy: SortComparisonStrategy = SortComparisonStrategy.Default,
) {
  if (sortComparisonStrategy === SortComparisonStrategy.StringCaseInsensitive) {
    return (left: any, right: any) => {
      if (!left && !right) {
        return 0
      }
      if (!left && right) {
        return -1
      }
      if (left && !right) {
        return 1
      }
      if (left[sortOnProperty].toUpperCase() < right[sortOnProperty].toUpperCase()) {
        return -1
      }
      if (left[sortOnProperty].toUpperCase() > right[sortOnProperty].toUpperCase()) {
        return 1
      }
      return 0
    }
  }

  if (sortComparisonStrategy === SortComparisonStrategy.StringOrdinal) {
    return (left: any, right: any) => {
      if (!left && !right) {
        return 0
      }
      if (!left && right) {
        return -1
      }
      if (left && !right) {
        return 1
      }
      if (left[sortOnProperty].toString() < right[sortOnProperty].toString()) {
        return -1
      }
      if (left[sortOnProperty].toString() > right[sortOnProperty].toString()) {
        return 1
      }
      return 0
    }
  }

  if (sortComparisonStrategy === SortComparisonStrategy.Default) {
    return (left: any, right: any) => {
      if (!left && !right) {
        return 0
      }
      if (!left && right) {
        return -1
      }
      if (left && !right) {
        return 1
      }
      if (left[sortOnProperty] < right[sortOnProperty]) {
        return -1
      }
      if (left[sortOnProperty] > right[sortOnProperty]) {
        return 1
      }
      return 0
    }
  }

  throw new Error('Unsupported SortComparisonStrategy: ' + SortComparisonStrategy)
}
