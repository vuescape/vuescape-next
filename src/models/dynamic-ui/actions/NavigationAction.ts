import type { NavigationActionPayload } from './NavigationActionPayload'

/**
 * Represents an action to navigate within the application.
 */
export interface NavigationAction {
  /** The type of action, which is always 'navigate' in order to identify this type. */
  type: 'navigate'

  /** The payload containing navigation details. */
  payload: NavigationActionPayload
}
