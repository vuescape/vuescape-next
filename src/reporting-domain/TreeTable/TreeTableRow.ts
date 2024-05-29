import { type Link } from '../../reporting-domain'
import { type TreeTableCell } from './TreeTableCell'
import { type TreeTableRowDependency } from './TreeTableRowDependency'

/**
 * Interface representing a TreeTableRow.
 */
export interface TreeTableRow {
  /** Unique identifier for this row. This will be used as a key for updating the DOM. */
  id: string

  /** The cells of the TreeTableRow. */
  cells: Array<TreeTableCell>

  /** The depth of the TreeTableRow. */
  depth: number

  /** The renderer of the TreeTableRow. Can be a string or an object. */
  renderer: string | any

  /** The CSS classes of the TreeTableRow. */
  cssClasses?: string

  /** Whether the TreeTableRow is expandable. */
  isExpandable: boolean

  /** Whether the TreeTableRow is expanded. */
  isExpanded: boolean

  /** Whether the TreeTableRow is visible. */
  isVisible: boolean

  /** Whether the TreeTableRow is selected. */
  isSelected: boolean

  /** Whether the TreeTableRow is focused. */
  isFocused?: boolean

  /** The links of the TreeTableRow. Can be a string or an object. */
  links?: Record<string, Array<Link>>

  /** The children of the TreeTableRow. */
  children?: Array<TreeTableRow>

  /** Whether the TreeTableRow should display children. */
  shouldDisplayChildren?: boolean

  /** The expanded summary rows of the TreeTableRow. */
  expandedSummaryRows?: Array<TreeTableRow>

  /** The collapsed summary rows of the TreeTableRow. */
  collapsedSummaryRows?: Array<TreeTableRow>

  /** The onclick function of the TreeTableRow. */
  onclick?: () => void

  /** The value of the TreeTableRow. Can be any value. */
  value?: any

  /** The dependencies of the TreeTableRow. Used to track dependencies
   * (could be between rows or something else) for a row. The specific implementation of when and how to handle those dependencies is up to the author.
   */
  dependencies?: Array<TreeTableRowDependency>
}
