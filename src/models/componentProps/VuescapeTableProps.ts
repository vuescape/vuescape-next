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
