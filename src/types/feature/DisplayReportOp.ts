import {
  type LinkedResourceOpBase,
  ReportPaneKind,
  ReportPaneTitleBarButtons,
} from '@/types'

/**
 * Interface representing a display report operation.
 */
export interface DisplayReportOp extends LinkedResourceOpBase {
  /** The kind of the targeted report pane. */
  targetedPaneKind: ReportPaneKind

  /** The initial width of the report pane. */
  initialWidth?: number

  /** The minimum width of the report pane. */
  minimumWidth?: number

  /** The maximum width of the report pane. */
  maximumWidth?: number

  /** The buttons on the title bar of the report pane. */
  reportPaneTitleBarButtons?: ReportPaneTitleBarButtons
}
