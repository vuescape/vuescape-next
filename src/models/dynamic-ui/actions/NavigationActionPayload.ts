import type { LinkTarget } from '../../../reporting-domain'

/**
 * Represents the payload for a navigation action.
 */
export interface NavigationActionPayload {
  url: string
  target?: LinkTarget
  replace?: boolean
}
