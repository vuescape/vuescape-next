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
}
