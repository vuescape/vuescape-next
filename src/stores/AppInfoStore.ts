import type { AppInfo } from '../types'

// Define an interface for the AppInfo store
export interface AppInfoStore {
  state: AppInfo // The state of the store
  fetchAppInfoAsync: () => Promise<void> // Method to fetch app info
  startPolling: (pollingIntervalMilliseconds?: number) => void // Method to start polling
  stopPolling: () => void // Method to stop polling
}
