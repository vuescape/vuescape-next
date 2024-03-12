import { NavigationItemKind } from './NavigationItemKind'
import type { NavigationLink } from './NavigationLink'

export interface NavigationItemBase {
  link: NavigationLink
  kind: NavigationItemKind
}
