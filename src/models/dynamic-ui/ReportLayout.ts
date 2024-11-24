import type { ReportPaneKind } from '../feature'
import type { PaneLayout } from './PaneLayout'

export interface ReportLayout {
  id: string
  title?: string
  content?: PaneLayout
  // These are only used in the UI, not in the domain
  paneWidthPercent?: number
  targetPane?: ReportPaneKind
}
