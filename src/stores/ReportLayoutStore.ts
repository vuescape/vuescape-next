import type { Ref } from 'vue'
import type { ReportLayout } from '../models'

export interface ReportLayoutStore {
  state: Array<ReportLayout> | Ref<Array<ReportLayout>>
  setReportLayoutState: (reportLayouts: Array<ReportLayout>) => void
  setReportLayout: (reportLayout: ReportLayout) => void
}
