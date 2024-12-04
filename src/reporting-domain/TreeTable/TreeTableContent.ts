import type { SortLevel, TreeTableHeaderRow, TreeTableRow } from './index'

/**
 * Interface representing the content of a TreeTable.
 */
export interface TreeTableContent {
  /** The headers of the TreeTable. */
  headers: Array<TreeTableHeaderRow>

  /** The footers of the TreeTable. */
  footers: Array<TreeTableRow>

  /** The rows of the TreeTable. */
  rows: Array<TreeTableRow>

  /** Whether the TreeTable should scroll vertically. */
  shouldScrollVertical: boolean

  /** Whether the TreeTable should scroll horizontally. */
  shouldScrollHorizontal: boolean

  /** Whether the TreeTable should sync header scroll. */
  shouldSyncHeaderScroll: boolean

  /** Whether the TreeTable should sync footer scroll. */
  shouldSyncFooterScroll: boolean

  /** Whether the TreeTable should include footer. */
  shouldIncludeFooter: boolean

  /** The color of the dead area in the TreeTable. */
  deadAreaColor: string

  /** The maximum number of rows in the TreeTable. */
  maxRows?: number

  /** The CSS class of the TreeTable. */
  cssClass: string

  /** The CSS styles of the TreeTable. */
  cssStyles: Record<string, string>

  /** The level in the hierarchy to sort on in the TreeTable. */
  sortLevel: SortLevel
}
