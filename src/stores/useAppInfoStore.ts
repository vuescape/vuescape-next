import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usingRetryForFetchAsync } from '../http'
import type { AppInfo } from '../models'
import type { AppInfoStore } from './AppInfoStore'

const POLLING_INTERVAL_MILLISECONDS: number = 60000

/**
 * A Pinia store that manages application information.
 *
 * @remarks
 * This store fetches and maintains the application information such as version, messages, and disabled features.
 * It also supports polling to periodically update the application information.
 */
export const useAppInfoStore = defineStore('useAppInfoStore', () => {
  // Property order matters here because of the use of JSON.stringify in fetchAppInfoAsync
  const state = ref<AppInfo>({
    version: '',
    messages: [],
    disabledFeatures: []
  })

  let poller: any = null

  /**
   * Fetches the application information asynchronously from the '/appInfo.json' endpoint.
   * If the fetched app info differs from the current state, updates the state with the new app info.
   * @returns {Promise<void>} A promise that resolves when the fetch operation is complete.
   */
  async function fetchAppInfoAsync() {
    const response = await usingRetryForFetchAsync('/appInfo.json')
    if (response.ok) {
      const appInfo = await response.json()
      if (JSON.stringify(appInfo) !== JSON.stringify(state.value)) {
        setAppInfoState(appInfo)
      }
    } else {
      // Ignore error since app can still work if app info is not available
      console.error('Failed to fetch app info:', response)
    }
  }

  /**
   * Starts polling at a specified interval to fetch application information.
   * If polling is already in progress, this function will not start another poller.
   *
   * @param pollingIntervalMilliseconds - The interval in milliseconds at which to poll for application information. Defaults to `POLLING_INTERVAL_MILLISECONDS`.
   */
  function startPolling(pollingIntervalMilliseconds: number = POLLING_INTERVAL_MILLISECONDS) {
    if (poller) {
      return
    }
    poller = setInterval(async () => {
      await fetchAppInfoAsync()
    }, pollingIntervalMilliseconds)
    // eslint-disable-next-line no-console
    console.info(
      `AppInfo Polling started with interval of ${pollingIntervalMilliseconds} milliseconds`
    )
  }

  /**
   * Stops the polling process by clearing the interval associated with the poller.
   * If the poller is not defined, the function does nothing.
   */
  function stopPolling() {
    if (poller) {
      // eslint-disable-next-line no-console
      console.info('AppInfo Polling stopped')
      clearInterval(poller)
    }
  }

  /**
   * Updates the application state with the provided app information.
   *
   * @param appInfo - The application information to set in the state.
   */
  function setAppInfoState(appInfo: AppInfo) {
    // Set properties individually to maintain reactivity
    state.value.disabledFeatures = appInfo.disabledFeatures
    state.value.messages = appInfo.messages
    state.value.version = appInfo.version
  }

  /**
   * The `result` object represents the application information store.
   * It contains the state and various methods to manage and fetch application information.
   */
  const result: AppInfoStore = {
    state,
    fetchAppInfoAsync,
    startPolling,
    stopPolling,
    setAppInfoState
  }
  return result
})
