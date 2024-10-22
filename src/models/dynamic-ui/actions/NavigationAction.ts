import type { NavigateActionPayload } from './NavigateActionPayload'

export interface NavigationAction {
  type: 'navigate'
  payload: NavigateActionPayload
}
