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

  /**
   * Gets the bare page title from the report layouts (no loading states or fallbacks).
   * @returns The raw page title from the report layouts, or empty string if no title is found
   */
  getBarePageTitle: () => string

  /**
   * Gets the page title with loading states and fallbacks.
   * @param isLoading - Whether the report is currently loading
   * @returns The page title with loading states and fallbacks
   */
  getPageTitle: (isLoading?: boolean) => string
}
