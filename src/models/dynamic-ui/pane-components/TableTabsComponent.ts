import type { TableTabsComponentPayload } from './TableTabsComponentPayload'

/**
 * Represents a set of table tabs.
 */
export interface TableTabsComponent {
  /**
   * The type of the component, which is always 'tableTabs'.
   */
  type: 'tableTabs'

  /**
   * The payload associated with the TableTabs component.
   */
  payload: TableTabsComponentPayload
}
