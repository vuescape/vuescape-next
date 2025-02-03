/**
 * Interface representing properties used for comparison as different types.
 * For example, this allows sorting numerically vs string sorting.
 */
export interface ComparableValue {
  /**
   * The string value.
   */
  stringValue?: string
  /**
   * The numeric value.
   */
  numericValue?: number
  /**
   * The date value.
   */
  dateValue?: Date
  /**
   * The boolean value.
   */
  booleanValue?: boolean
}
