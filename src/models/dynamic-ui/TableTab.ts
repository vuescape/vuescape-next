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
}
