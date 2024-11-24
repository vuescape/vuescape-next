import type { LinkTarget } from '../../../reporting-domain'

export interface NavigationActionPayload {
  url: string
  target?: LinkTarget
  replace?: boolean
}
