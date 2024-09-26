import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usingRetryForFetch } from '../http'
import type { AppInfo } from '../types'
import type { AppInfoStore } from './AppInfoStore'

const POLLING_INTERVAL_MILLISECONDS: number = 60000

export const useAppInfoStore = defineStore('useAppInfoStore', () => {
  const state = ref<AppInfo>({
    disabledFeatures: [],
    messages: [],
    version: ''
  })

  let poller: any = null

  async function fetchAppInfoAsync() {
    // const response = await fetch('/appInfo.json', undefined)
    const response = await usingRetryForFetch('/appInfo.json')
    console.info(response)
    if (response.ok) {
      const appInfo = await response.json()
      console.info(appInfo)
      if (JSON.stringify(appInfo) !== JSON.stringify(state.value)) {
        state.value = appInfo
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

  const result: AppInfoStore = { state, fetchAppInfoAsync, startPolling, stopPolling }
  return result
})
