import { ClientBehavior, type TreeTableContent } from './index'
import { type ColumnDefinition } from '..'

export interface TreeTable {
  id: string
  columnDefinition: ColumnDefinition
  content: TreeTableContent
  behaviors: Array<ClientBehavior>
}
