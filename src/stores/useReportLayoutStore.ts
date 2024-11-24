import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReportLayoutStore } from './ReportLayoutStore'
import type { ReportLayout } from '../models'

export const useReportLayoutStore = defineStore('useReportLayoutStore', () => {
  const state = ref<Array<ReportLayout>>([])

  function setReportLayoutState(reportLayouts: Array<ReportLayout>) {
    state.value = reportLayouts
  }

  function setReportLayout(reportLayout: ReportLayout) {
    const index = state.value.findIndex((rl) => rl.id === reportLayout.id)
    if (index >= 0) {
      state.value[index] = reportLayout
    } else {
      state.value.push(reportLayout)
    }
  }

  const result: ReportLayoutStore = {
    state,
    setReportLayoutState,
    setReportLayout
  }
  return result
})
