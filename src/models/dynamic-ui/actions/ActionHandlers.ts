import type { ActionStore } from '../../../stores'
import type { NavigationAction } from './NavigationAction'
import type { Router } from 'vue-router'
import { LinkTarget } from '../../../reporting-domain'
import type { NoAction } from './NoAction'
import type { ReportPaneKind } from '../../feature'

export async function handleAction(
  actionStoreState: ActionStore,
  router: Router,
  loadReport: (url: string) => Promise<void>
): Promise<void> {
  if (actionStoreState.action.type === 'navigate') {
    await handleNavigationAction(
      actionStoreState.action,
      actionStoreState.paneKind,
      router,
      loadReport
    )
  } else if (actionStoreState.action.type === 'noAction') {
    await handleNoAction(actionStoreState.action, actionStoreState.paneKind)
  } else {
    throw new Error('Unknown action type: ' + actionStoreState.action)
  }
}

export async function handleNoAction(action: NoAction, sourcePane: ReportPaneKind): Promise<void> {
  console.warn('No action handler invoked. No action to take.', action, sourcePane)
}

export async function handleNavigationAction(
  action: NavigationAction,
  sourcePane: ReportPaneKind,
  router: Router,
  loadReport: (url: string) => Promise<void>
): Promise<void> {
  const target = action?.payload?.target
  if (!target) {
    return
  }
  // console.info(router.currentRoute.value)

  if (
    target === LinkTarget.CenterPane ||
    target === LinkTarget.LeftPane ||
    target === LinkTarget.RightPane ||
    target === LinkTarget.CurrentPane
  ) {
    await loadReport(action.payload.url)
    if (action.payload.replace === true) {
      router.replace(action.payload.url)
    } else {
      const route = '/my-data' + action.payload.url
      router.push(route)
    }
  } else if (target === LinkTarget.CurrentWindow) {
    if (action.payload.url.startsWith('http')) {
      if (action.payload.replace === true) {
        window.location.replace(action.payload.url)
      } else {
        window.location.assign(action.payload.url)
      }
    } else if (action.payload.replace === true) {
      router.replace(action.payload.url)
    } else {
      history.replaceState(null, '', action.payload.url)
      // router.push(action.payload.url)
    }
  } else if (target === LinkTarget.NewWindow) {
    // console.log('Opening new window ' + action.payload.url)
    window.open(action.payload.url, '_blank')
  } else if (target === LinkTarget.Download) {
    throw new Error('LinkTarget.Download Not implemented')
  } else if (target == LinkTarget.Modal) {
    throw new Error('LinkTarget.Modal Not implemented')
  } else if (target == LinkTarget.None) {
    throw new Error('LinkTarget.None not supported')
  }
}
