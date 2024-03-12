import { type CellFormat } from './CellFormat'
import { type Slots } from './Slots'
import { type TreeTableRow } from './TreeTableRow'

import { type Hover, type  Link } from '@vuescape/reporting-domain'

export interface TreeTableCell {
  id: string
  displayValue?: string
  value: any
  hover?: Hover
  renderer: string | any
  cssClasses?: string
  cssStyles?: Record<string, string>
  colspan?: number
  // Use this for clicking expand/collapse
  onclick?: (row?: TreeTableRow, item?: TreeTableCell) => void
  isVisible?: boolean
  links?: Record<string, Link>
  slots?: Slots
  cellFormat?: CellFormat
}
