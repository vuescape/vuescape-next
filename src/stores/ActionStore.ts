import type { Action } from '../models'
import type { ReportPaneKind } from '../models/feature'

/**
 * Represents a store for actions and pane kinds.
 *
 * @interface ActionStore
 */
export interface ActionStore {
  /**
   * The action to be performed.
   */
  action: Action

  /**
   * The kind of report pane.
   */
  paneKind: ReportPaneKind
}
