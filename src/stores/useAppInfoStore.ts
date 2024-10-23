import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usingRetryForFetch } from '../http'
import type { AppInfo } from '../models'
import type { AppInfoStore } from './AppInfoStore'

const POLLING_INTERVAL_MILLISECONDS: number = 60000

export const useAppInfoStore = defineStore('useAppInfoStore', () => {
  // Property order matters here because of the use of JSON.stringify in fetchAppInfoAsync
  const state = ref<AppInfo>({
    version: '',
    messages: [],
    disabledFeatures: []
  })

  let poller: any = null

  async function fetchAppInfoAsync() {
    const response = await usingRetryForFetch('/appInfo.json')
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

  function startPolling(pollingIntervalMilliseconds: number = POLLING_INTERVAL_MILLISECONDS) {
    if (poller) {
      return
    }
    poller = setInterval(async () => {
      await fetchAppInfoAsync()
    }, pollingIntervalMilliseconds)
  }

  function stopPolling() {
    poller && clearInterval(poller)
  }

  function setAppInfoState(appInfo: AppInfo) {
    state.value.disabledFeatures = appInfo.disabledFeatures
    state.value.messages = appInfo.messages
    state.value.version = appInfo.version
  }

  const result: AppInfoStore = {
    state,
    fetchAppInfoAsync,
    startPolling,
    stopPolling,
    setAppInfoState
  }
  return result
})
