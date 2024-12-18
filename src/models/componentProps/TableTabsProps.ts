import type { SelectComponent } from '../dynamic-ui/pane-components/SelectComponent'
import type { TableTab } from '../dynamic-ui/TableTab'

/**
 * Represents a set of table tabs.
 */
export interface TableTabsProps {
  /**
   * A unique identifier for the entire tab set.
   */
  id: string

  /**
   * The collection of table tabs available.
   */
  tabs: Array<TableTab>

  /**
   * The select component that will be displayed above the table tabs.
   */
  selectComponent?: SelectComponent
}
