import type { TableCell } from './TableCell'

/**
 * Represents a table row.
 */
export interface TableRow {
  /**
   * The unique identifier for the row.
   */
  id: string
  /**
   * The cells of the row.
   */
  cells: Record<string, TableCell>
}
