import type { Ref } from 'vue'
import type { ReportLayout } from '../models'

/**
 * Interface representing the store for report layouts.
 */
export interface ReportLayoutStore {
  /**
   * The state of the report layouts, which can be an array of ReportLayout objects or a Ref to an array of ReportLayout objects.
   */
  state: Array<ReportLayout> | Ref<Array<ReportLayout>>

  /**
   * Sets the state of the report layouts.
   * @param reportLayouts - An array of ReportLayout objects to set as the new state.
   */
  setReportLayoutState: (reportLayouts: Array<ReportLayout>) => void

  /**
   * Sets a single report layout.
   * @param reportLayout - A ReportLayout object to set.
   */
  setReportLayout: (reportLayout: ReportLayout) => void
}
