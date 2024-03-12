import { type TreeTableCell } from './TreeTableCell'
import { type TreeTableRowDependency } from './TreeTableRowDependency'

import { type Link } from '@vuescape/reporting-domain'

export interface TreeTableRow {
  // unique identifier for this row.  This will be used as a key for updating the DOM.
  id: string
  cells: Array<TreeTableCell>
  depth: number
  renderer: string | any
  cssClasses?: string
  isExpandable: boolean
  isExpanded: boolean
  isVisible: boolean
  isSelected: boolean
  isFocused?: boolean
  // can be a string or an object
  links?: Record<string, Array<Link>>
  children?: Array<TreeTableRow>
  shouldDisplayChildren?: boolean
  expandedSummaryRows?: Array<TreeTableRow>
  collapsedSummaryRows?: Array<TreeTableRow>

  onclick?: () => void
  // Any value
  value?: any
  // Dependencies are used to track dependencies (could be between rows or something else) for a row
  // The specific implementation of when and how to handle those dependencies is up to the author.
  dependencies?: Array<TreeTableRowDependency>
}
