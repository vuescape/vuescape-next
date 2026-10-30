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
  /**
   * The rows nested under this row, keyed by the same column ids, shown while this row is expanded.
   * Undefined or null when the row has none. A table with any child rows is shown as a tree.
   */
  childRows?: Array<TableRow> | null
  /**
   * Whether the row starts expanded. The user can still collapse it. Defaults to collapsed.
   */
  isExpanded?: boolean | null
}
