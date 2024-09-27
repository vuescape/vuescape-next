/**
 * Interface representing the application information.
 */
export interface AppInfo {
  /**
   * The version of the application.
   */
  version: string

  /**
   * Global messages to display.  e.g. notification of upcoming maintenance
   */
  messages?: Array<{
    text: string
    severity: 'info' | 'warn' | 'error' | 'success'
    closeable?: boolean
  }>

  /**
   * The list of features that are disabled.
   */
  disabledFeatures: Array<string>
}
