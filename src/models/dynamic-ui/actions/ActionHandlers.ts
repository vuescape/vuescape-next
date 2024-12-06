import type { ActionStore } from '../../../stores'
import type { NavigationAction } from './NavigationAction'
import type { Router } from 'vue-router'
import { LinkTarget } from '../../../reporting-domain'
import type { NoAction } from './NoAction'
import type { ReportPaneKind } from '../../feature'

/**
 * Handles different types of actions based on the action type in the action store state.
 *
 * @param actionStoreState - The state of the action store containing the action to be handled.
 * @param router - The router instance used for navigation actions.
 * @param loadReport - A function to load a report given a URL.
 * @returns A promise that resolves when the action has been handled.
 * @throws Will throw an error if the action type is unknown.
 */
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

/**
 * Handles navigation actions based on the specified target and payload.
 *
 * @param {NavigationAction} action - The navigation action containing the payload and target.
 * @param {ReportPaneKind} sourcePane - The source pane from which the action originated.
 * @param {Router} router - The router instance used for navigation.
 * @param {(url: string) => Promise<void>} loadReport - A function to load a report given a URL.
 *
 * @returns {Promise<void>} A promise that resolves when the navigation action is handled.
 *
 * @throws {Error} If the target is LinkTarget.Download or LinkTarget.Modal, an error is thrown indicating that the target is not implemented.
 */
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
