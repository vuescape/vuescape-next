/**
 * Interface representing the application information.
 */
export interface AppInfo {
  /**
   * The version of the application.
   */
  version: string

  /**
   * Indicates whether the site is in maintenance mode.
   */
  isSiteInMaintenanceMode: boolean

  /**
   * The message to display when the site is in maintenance mode.
   */
  siteMaintenanceMessage: string

  /**
   * The list of features that are disabled.
   */
  disabledFeatures: Array<string>
}
