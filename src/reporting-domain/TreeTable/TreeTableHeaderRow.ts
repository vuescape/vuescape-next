import { type TreeTableHeaderCell } from '../../reporting-domain'

/**
 * Interface representing a TreeTableHeaderRow.
 */
export interface TreeTableHeaderRow {
  /** The id of the TreeTableHeaderRow. */
  id: string

  /** The cells of the TreeTableHeaderRow. */
  cells: Array<TreeTableHeaderCell>

  /** The CSS classes of the TreeTableHeaderRow. */
  cssClasses?: string

  /** The renderer of the TreeTableHeaderRow. Can be a string or an object. */
  renderer: string | any
}
