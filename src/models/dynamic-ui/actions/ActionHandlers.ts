import type { Router } from 'vue-router'

import { LinkTarget } from '../../../reporting-domain/Link/LinkTarget'
import type { ActionStore } from '../../../stores/useActionStore'
import { ReportPaneKind } from '../../feature/ReportPaneKind'
import type { Action } from './Action'
import type { NavigationAction } from './NavigationAction'
import type { NoAction } from './NoAction'

/* Handles different types of actions based on the action type in the action store state.
 *
 * @param state - The state of the action store containing the action to be handled.
 * @param router - The router instance used for navigation actions.
 * @param loadReport - A function to load a report given a URL.
 * @returns A promise that resolves when the action has been handled.
 * @throws Will throw an error if the action type is unknown.
 */
export async function handleActionAsync(
  state: { action: Action; paneKind: ReportPaneKind },
  router: Router,
  loadReport: (url: string) => Promise<void>
): Promise<void> {
  if (state.action.type === 'navigate') {
    await handleNavigationActionAsync(state.action, state.paneKind, router, loadReport)
  } else if (state.action.type === 'noAction') {
    handleNoAction(state.action, state.paneKind)
  } else {
    throw new Error('Unknown action type: ' + state.action)
  }
}

export function handleNoAction(action: NoAction, sourcePane: ReportPaneKind): void {
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
export async function handleNavigationActionAsync(
  action: NavigationAction,
  sourcePane: ReportPaneKind,
  router: Router,
  loadReport: (url: string) => Promise<void>
): Promise<void> {
  const target = action?.payload?.target
  if (!target) {
    return
  }
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
      const route = action.payload.url
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
      // console.info('Navigating to for LinkTarget.CurrentWindow' + action.payload.url)
      router.push(action.payload.url)
    }
  } else if (target === LinkTarget.NewWindow) {
    // console.log('Opening new window ' + action.payload.url)
    window.open(action.payload.url, '_blank')
  } else if (target === LinkTarget.Download) {
    throw new Error('LinkTarget.Download Not implemented')
  } else if (target == LinkTarget.Modal) {
    throw new Error('LinkTarget.Modal Not implemented')
  } else if (target === LinkTarget.Navigate) {
    // Pure UI navigation without report loading
    if (action.payload.replace === true) {
      router.replace(action.payload.url)
    } else {
      router.push(action.payload.url)
    }
  } else if (target == LinkTarget.None) {
    throw new Error('LinkTarget.None not supported')
  }
}

/**
 * Handles an action event by updating the action store so that the action can be completed.
 *
 * @param event - The event object triggered by the action.
 * @param action - The action to be handled.
 * @param actionStore - The store where the action and pane kind will be updated.
 */
export function handleActionEvent(event: Event, action: Action, actionStore: ActionStore): void {
  const paneKind = getSourcePaneKind(event)
  actionStore.dispatch(action, paneKind)
}

/**
 * Retrieves the pane kind from the closest ancestor element with the `data-panekind` attribute.
 *
 * @param event - The event object from which the target element is derived.
 * @returns The pane kind as a string if the `data-panekind` attribute is found, otherwise returns `ReportPaneKind.None`.
 */
export function getSourcePaneKind(event: Event): ReportPaneKind {
  const clickedElement = event.target as HTMLElement
  const paneElement = clickedElement.closest('[data-panekind]') as HTMLElement | null

  const paneKind = paneElement?.dataset.panekind

  if (paneKind && Object.values(ReportPaneKind).includes(paneKind as ReportPaneKind)) {
    return paneKind as ReportPaneKind
  }

  return ReportPaneKind.None
}
