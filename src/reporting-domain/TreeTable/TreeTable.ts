import { type ColumnDefinition } from '../../reporting-domain'
import { ClientBehavior, type TreeTableContent } from './index'

/**
 * Interface representing a TreeTable.
 */
export interface TreeTable {
  /** The id of the TreeTable. */
  id: string

  /** The column definition of the TreeTable. */
  columnDefinition: ColumnDefinition

  /** The content of the TreeTable. */
  content: TreeTableContent

  /** The behaviors of the TreeTable. */
  behaviors: Array<ClientBehavior>
}
