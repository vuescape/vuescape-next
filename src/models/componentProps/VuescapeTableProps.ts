import type { TableColumn } from '../dynamic-ui/TableColumn'
import type { TableRow } from '../dynamic-ui/TableRow'

/**
 * Interface representing the properties for a table component.
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
}
