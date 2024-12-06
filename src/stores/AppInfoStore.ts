import type { Ref } from 'vue'
import type { AppInfo } from '../models'

/**
 * Interface representing the AppInfoStore.
 */
export interface AppInfoStore {
  /**
   * The state of the store. Receiver of the store gets AppInfo type but the store internally
   * returns a Ref<AppInfo>.
   *
   * @type {AppInfo | Ref<AppInfo>}
   */
  state: AppInfo | Ref<AppInfo>

  /**
   * Method to fetch app info asynchronously.
   *
   * @returns {Promise<void>}
   */
  fetchAppInfoAsync: () => Promise<void>

  /**
   * Method to start polling.
   *
   * @param {number} [pollingIntervalMilliseconds] - Optional polling interval in milliseconds.
   */
  startPolling: (pollingIntervalMilliseconds?: number) => void

  /**
   * Method to stop polling.
   */
  stopPolling: () => void

  /**
   * Method to set the app info state.
   *
   * @param {AppInfo} appInfo - The app info to set.
   */
  setAppInfoState: (appInfo: AppInfo) => void
}
