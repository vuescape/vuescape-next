import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Action, NoAction } from '../models/dynamic-ui/actions'
import { ReportPaneKind } from '../models/feature/ReportPaneKind'
import type { ActionStore } from './ActionStore'

export const useActionStore = defineStore('useActionStore', () => {
  const noAction: NoAction = { type: 'noAction' }
  const state = reactive<{ action: Action; paneKind: ReportPaneKind }>({
    action: noAction,
    paneKind: ReportPaneKind.None
  })

  return {
    ...state
  } as ActionStore
})
