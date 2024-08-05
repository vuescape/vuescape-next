import { type Hover, type  Link } from '@/reporting-domain'
import { type CellFormat } from './CellFormat'
import { type Slots } from './Slots'
import { type TreeTableRow } from './TreeTableRow'

/**
 * Interface representing a TreeTableCell.
 */
export interface TreeTableCell {
  /** The id of the TreeTableCell. */
  id: string

  /** The display value of the TreeTableCell. */
  displayValue?: string

  /** The actual value of the TreeTableCell. */
  value: any

  /** The hover information of the TreeTableCell. */
  hover?: Hover

  /** The renderer of the TreeTableCell. */
  renderer: string | any

  /** The CSS classes of the TreeTableCell. */
  cssClasses?: string

  /** The CSS styles of the TreeTableCell. */
  cssStyles?: Record<string, string>

  /** The colspan of the TreeTableCell. */
  colspan?: number

  /** The onclick event handler of the TreeTableCell. */
  onclick?: (row?: TreeTableRow, item?: TreeTableCell) => void

  /** The visibility of the TreeTableCell. */
  isVisible?: boolean

  /** The links of the TreeTableCell. */
  links?: Record<string, Link>

  /** The slots of the TreeTableCell. */
  slots?: Slots

  /** The cell format of the TreeTableCell. */
  cellFormat?: CellFormat
}
