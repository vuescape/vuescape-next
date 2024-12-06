import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReportLayoutStore } from './ReportLayoutStore'
import type { ReportLayout } from '../models'

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
   * The `result` object is an instance of `ReportLayoutStore` that contains the state and actions.
   */
  const result: ReportLayoutStore = {
    state,
    setReportLayoutState,
    setReportLayout
  }
  return result
})
