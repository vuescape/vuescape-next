import type { CssStyleWrapper } from './CssStyleWrapper'

/**
 * Interface representing CSS styles.
 */
export interface CssStyles {
  /** The CSS style for the table. Optional. */
  table?: CssStyleWrapper

  /** The CSS styles for all rows. Optional. */
  allRows?: Array<CssStyleWrapper>

  /** The CSS styles for all cells. Optional. */
  allCells?: Array<Array<CssStyleWrapper>>

  /** The CSS style for the current row. Optional. */
  currentRow?: CssStyleWrapper
}
