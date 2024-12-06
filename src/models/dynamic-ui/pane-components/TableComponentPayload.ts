/**
 * Represents the payload for a table component.
 */
export interface TableComponentPayload {
  /** An array of strings representing the headers of the table. */
  headers: Array<string>
  /** A two-dimensional array of strings representing the rows of the table. */
  rows: Array<Array<string>>
}
