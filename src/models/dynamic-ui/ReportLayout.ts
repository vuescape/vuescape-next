import type { ReportPaneKind } from '../feature/ReportPaneKind'
import type { PaneLayout } from './PaneLayout'

/**
 * Represents the layout of a report.
 */
export interface ReportLayout {
  /**
   * The unique identifier for the report layout.
   */
  id: string

  /**
   * The title of the report layout.
   * @optional
   */
  title?: string

  /**
   * The content of the report layout, represented as a PaneLayout.
   * @optional
   */
  content?: PaneLayout

  /**
   * The width of the pane as a percentage.
   * This is only used in the UI, not in the domain.
   * @optional
   */
  paneWidthPercent?: number

  /**
   * The kind of pane targeted by the report layout.
   * This is only used in the UI, not in the domain.
   * @optional
   */
  targetPane?: ReportPaneKind
}
