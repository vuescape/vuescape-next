import type { Action } from '../models'
import type { ReportPaneKind } from '../models/feature'

export interface ActionStore {
  action: Action
  paneKind: ReportPaneKind
}
