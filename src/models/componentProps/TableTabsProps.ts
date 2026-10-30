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

  /**
   * The id of the tab to show first. When it is not set, or matches no tab, the first tab with a table is shown, or
   * the first tab when none has one.
   */
  activeTabId?: string | null
}
