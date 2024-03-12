import { SortLevel, type TreeTableHeaderRow, type TreeTableRow } from './index'

export interface TreeTableContent {
  headers: Array<TreeTableHeaderRow>
  footers: Array<TreeTableRow>
  rows: Array<TreeTableRow>
  shouldScrollVertical: boolean
  shouldScrollHorizontal: boolean
  shouldSyncHeaderScroll: boolean
  shouldSyncFooterScroll: boolean
  shouldIncludeFooter: boolean
  deadAreaColor: string
  maxRows?: number
  cssClass: string
  cssStyles: Record<string, string>
  sortLevel: SortLevel
}
