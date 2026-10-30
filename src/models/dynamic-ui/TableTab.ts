import type { Action } from '../dynamic-ui/actions/Action'
import type { TableComponent } from '../dynamic-ui/pane-components/TableComponent'
import type { Tab } from './Tab'

/**
 * Represents a tab that displays a table component when active.
 *
 * @extends Tab
 */
export interface TableTab extends Tab {
  /**
   * The table component that this tab will display when active.
   */
  table?: TableComponent

  /**
   * The action to perform when this tab is selected. A deferred tab (one without a table) uses it to
   * load its content, e.g. by navigating to the route that renders the report with this tab's table.
   */
  onSelectAction?: Action
}
