import type { TableColumn } from '../dynamic-ui/TableColumn'
import type { TableRow } from '../dynamic-ui/TableRow'

/**
 * Interface representing the properties for a table component.
 */
/**
 * Interface representing the properties for the VuescapeTable component.
 */
export interface VuescapeTableProps {
  /**
   * The unique identifier for the table.
   */
  id: string

  /**
   * An array of objects representing the columns of the table.
   */
  columns: Array<TableColumn>

  /**
   * An array of objects representing the rows of the table.
   */
  rows: Array<TableRow>

  /**
   * The rows of the table's header, top to bottom, e.g. a row of group headings above the columns' headings. Their
   * cells are keyed by column id, like a row's, and can span columns. The bottom row's cells hold the columns' sort
   * controls. Child rows are not shown.
   * Undefined or null: one row of the columns' (deprecated) headerText, or none when no column has any. An empty array:
   * no header.
   */
  headerRows?: Array<TableRow> | null

  /**
   * Rows shown below the table's rows, e.g. totals, which stay in place when the rows scroll or are sorted.
   * Their cells are keyed by column id, like a row's, and can span columns. Child rows are not shown.
   */
  footerRows?: Array<TableRow>

  /**
   * Notes shown as text below the table, top to bottom, e.g. how to read its numbers. They are not part of the table:
   * they don't stay in place when the rows scroll. Undefined, null or empty: no notes.
   */
  footnotes?: Array<string> | null

  /**
   * The initial scroll position of the table.
   * @default 0
   */
  initialScrollPosition?: number

  /**
   * Whether to use deep watching for prop changes.
   * Set to false for large datasets to improve performance.
   * @default true
   */
  deepWatch?: boolean
}
