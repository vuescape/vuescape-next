import type { Router } from 'vue-router'

import { LinkTarget } from '../../../reporting-domain/Link/LinkTarget'
import type { ActionStore } from '../../../stores/useActionStore'
import { ReportPaneKind } from '../../feature/ReportPaneKind'
import type { Action } from './Action'
import type { DownloadAction } from './DownloadAction'
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
  if (state.action.typeName === 'action.navigate') {
    await handleNavigationActionAsync(state.action, state.paneKind, router, loadReport)
  } else if (state.action.typeName === 'action.download') {
    handleDownloadActionAsync(state.action, loadReport)
  } else if (state.action.typeName === 'action.noAction') {
    handleNoAction(state.action, state.paneKind)
  } else {
    throw new Error('Unknown action typeName: ' + state.action)
  }
}

export function handleNoAction(action: NoAction, sourcePane: ReportPaneKind): void {
  console.warn('No action handler invoked. No action to take.', action, sourcePane)
}

/**
 * Handles download actions based on the specified options.
 *
 * @param {DownloadAction} action - The download action containing the payload and options.
 *
 * @returns {void} Resolves when the download action is handled.
 */
export function handleDownloadActionAsync(
  action: DownloadAction,
  downloadReportAsync: (url: string) => Promise<void>
): void {
  if (action.payload.shouldResolveDownloadFile) {
    handleResolveDownloadAsync(action.payload.url, downloadReportAsync)
  } else {
    handleDirectDownloadAsync(action.payload.url)
  }
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
      await router.replace(action.payload.url)
    } else {
      const route = action.payload.url
      await router.push(route)
    }
  } else if (target === LinkTarget.CurrentWindow) {
    if (action.payload.url.startsWith('http')) {
      if (action.payload.replace === true) {
        window.location.replace(action.payload.url)
      } else {
        window.location.assign(action.payload.url)
      }
    } else if (action.payload.replace === true) {
      await router.replace(action.payload.url)
    } else {
      // console.info('Navigating to for LinkTarget.CurrentWindow' + action.payload.url)
      await router.push(action.payload.url)
    }
  } else if (target === LinkTarget.NewWindow) {
    // console.log('Opening new window ' + action.payload.url)
    window.open(action.payload.url, '_blank')
  } else if (target === LinkTarget.Modal) {
    throw new Error('LinkTarget.Modal Not implemented')
  } else if (target === LinkTarget.Navigate) {
    // Pure UI navigation without report loading
    if (action.payload.replace === true) {
      await router.replace(action.payload.url)
    } else {
      await router.push(action.payload.url)
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

/**
 * Handles direct download by posting a form to a hidden iframe.
 * This is used when we already know the file is valid and ready to download.
 *
 * @param url - The download URL with query parameters
 */
function handleDirectDownloadAsync(url: string): void {
  try {
    // Parse URL to extract endpoint and fields
    const { endpoint, fields } = parseUrlToEndpointAndFields(url)

    // Convert fields arrays to single values and add auth token
    const flatFields: Record<string, string> = {}
    Object.entries(fields).forEach(([key, values]) => {
      flatFields[key] = values[0] // Take first value if multiple
    })

    // Fire the form POST into the hidden iframe (download begins)
    postDownloadForm(endpoint, flatFields)
  } catch (error) {
    console.error('Direct download failed:', error)
    throw error
  }
}

/**
 * Handles two-phase download by invoking the delegated the logic,
 *
 * @param url - The URL containing datasetId and cellId parameters
 */
async function handleResolveDownloadAsync(
  url: string,
  downloadReportAsync: (url: string) => Promise<void>
): Promise<void> {
  await downloadReportAsync(url)
}

/**
 * Parses a URL to extract endpoint and query parameters.
 */
export function parseUrlToEndpointAndFields(urlStr: string): {
  endpoint: string
  fields: Record<string, string[]>
} {
  const u = new URL(urlStr)
  const endpoint = u.origin + u.pathname // keeps scheme, host, port, path
  const fields: Record<string, string[]> = {}
  u.searchParams.forEach((value, key) => {
    ;(fields[key] ??= []).push(value)
  })
  return { endpoint, fields }
}

/**
 * Posts a download form to a hidden iframe.
 */
export function postDownloadForm(actionUrl: string, fields: Record<string, string>): void {
  // Reuse a single hidden iframe as a download sink
  const iframeName = 'download_iframe_sink'
  let sink = document.querySelector<HTMLIFrameElement>(`iframe[name="${iframeName}"]`)
  if (!sink) {
    sink = document.createElement('iframe')
    sink.name = iframeName
    sink.style.display = 'none'
    document.body.appendChild(sink)
  }

  // Build a classic form POST (no CORS/fetch needed for the download itself)
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = actionUrl
  form.target = iframeName
  form.style.display = 'none'

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
  form.remove()
}
