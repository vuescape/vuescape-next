import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { Action, NoAction } from '../models/dynamic-ui/actions'
import { ReportPaneKind } from '../models/feature/ReportPaneKind'

/**
 * A Pinia store that manages the state of actions and pane kinds.
 *
 * @returns {ActionStore} The state and actions for managing navigation actions and pane kinds.
 */
export const useActionStore = defineStore('useActionStore', () => {
  const noAction: NoAction = Object.freeze({ typeName: 'action.noAction', payload: {} } as const)

  // state
  const action = shallowRef<Action>(noAction)
  const paneKind = ref<ReportPaneKind>(ReportPaneKind.None)

  // actions
  function dispatch(newAction: Action, pane: ReportPaneKind = ReportPaneKind.None) {
    // new ref each time dispatch is called to ensure reactivity
    action.value = { ...newAction }
    paneKind.value = pane
  }

  function clear() {
    action.value = noAction
  }

  return {
    action,
    paneKind,
    dispatch,
    clear
  }
})

export type ActionStore = ReturnType<typeof useActionStore>
