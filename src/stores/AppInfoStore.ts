import type { Ref } from 'vue'
import type { AppInfo } from '../models'

// Define an interface for the AppInfo store
export interface AppInfoStore {
  // The state of the store. Receiver of the store gets AppInfo type but the store internally
  // returns a Ref<AppInfo>.
  state: AppInfo | Ref<AppInfo>
  fetchAppInfoAsync: () => Promise<void> // Method to fetch app info
  startPolling: (pollingIntervalMilliseconds?: number) => void // Method to start polling
  stopPolling: () => void // Method to stop polling
  setAppInfoState: (appInfo: AppInfo) => void
}
