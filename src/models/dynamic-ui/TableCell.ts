import type { UiObject } from '../../reporting-domain'
import type { ComparableValue } from './ComparableValue'
import type { PaneComponent } from './pane-components'

/**
 * Interface representing the properties for a table cell.
 */
export interface TableCell {
  /**
   * The value to display in the cell if no component is provided.
   */
  displayValue?: string | null
  /**
   * The component to use for rendering the cell.
   * If not provided, the displayValue  will be used.
   */
  component?: PaneComponent
  /**
   * The raw value of the cell.
   */
  rawValue?: UiObject
  /**
   * The value used for comparisons such as filtering or sorting.
   * If not provided, the displayValue will be used followed by the rawValue.
   */
  comparableValue?: ComparableValue
  /**
   * The inline styles of the cell.
   */
  cssStyles?: Record<string, string>
}
