/**
 * Enum representing the wrapping behavior of a cell.
 */
export enum ColumnWrapBehavior {
  /** No wrapping behavior. */
  None = 0,

  /** Wraps the contents of the cell. */
  Wrap,

  /** Doesn't wrap the contents of the cell and truncates if it doesn't fit. */
  NoWrapAndTruncate,

  /** Doesn't wrap the contents of the cell and displays an ellipsis if it doesn't fit. */
  NoWrapAndDisplayEllipsis,
}
