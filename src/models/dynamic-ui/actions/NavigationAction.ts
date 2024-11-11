import type { NavigationActionPayload } from './NavigationActionPayload'

export interface NavigationAction {
  type: 'navigate'
  payload: NavigationActionPayload
}
