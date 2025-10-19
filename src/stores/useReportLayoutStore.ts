import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReportLayoutStore } from './ReportLayoutStore'
import type { ReportLayout } from '../models'
import { ReportPaneKind } from '../models/feature/ReportPaneKind'

/**
 * A Pinia store for managing report layouts.
 *
 * @returns {ReportLayoutStore} The store instance with state and actions.
 */
export const useReportLayoutStore = defineStore('useReportLayoutStore', () => {
  const state = ref<Array<ReportLayout>>([])

  /**
   * Sets the state of the report layouts.
   *
   * @param reportLayouts - An array of report layout objects to set as the new state.
   */
  function setReportLayoutState(reportLayouts: Array<ReportLayout>) {
    state.value = reportLayouts
  }

  /**
   * Updates the report layout in the state if it exists, otherwise adds it to the state.
   *
   * @param reportLayout - The report layout to be set or added.
   */
  function setReportLayout(reportLayout: ReportLayout) {
    const index = state.value.findIndex((rl) => rl.id === reportLayout.id)
    if (index >= 0) {
      state.value[index] = reportLayout
    } else {
      state.value.push(reportLayout)
    }
  }

  /**
   * Gets the bare page title from the report layouts (no loading states or fallbacks).
   * Extracts the title from the center pane, left pane, or right pane in that order of preference.
   *
   * @returns The raw page title from the report layouts, or empty string if no title is found
   */
  function getBarePageTitle(): string {
    const reportLayouts = state.value
    if (reportLayouts && reportLayouts.length > 0) {
      const leftPaneReportTitle = reportLayouts.find(
        (report) => report.targetPane === ReportPaneKind.LeftPane
      )?.title
      const centerPaneReportTitle = reportLayouts.find(
        (report) => report.targetPane === ReportPaneKind.CenterPane
      )?.title
      const rightPaneReportTitle = reportLayouts.find(
        (report) => report.targetPane === ReportPaneKind.RightPane
      )?.title

      return centerPaneReportTitle || leftPaneReportTitle || rightPaneReportTitle || ''
    }

    return ''
  }

  /**
   * Gets the page title with loading states and fallbacks.
   * Handles loading states and provides fallback titles.
   *
   * @param isLoading - Whether the report is currently loading
   * @returns The page title with loading states and fallbacks
   */
  function getPageTitle(isLoading: boolean = false): string {
    if (isLoading) {
      return 'Loading...'
    }

    const bareTitle = getBarePageTitle()
    return bareTitle || 'Report'
  }

  /**
   * The `result` object is an instance of `ReportLayoutStore` that contains the state and actions.
   */
  const result: ReportLayoutStore = {
    state,
    setReportLayoutState,
    setReportLayout,
    getPageTitle,
    getBarePageTitle
  }
  return result
})
