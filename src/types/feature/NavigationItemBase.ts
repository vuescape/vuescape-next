import { NavigationItemKind } from './NavigationItemKind'
import type { NavigationLink } from './NavigationLink'

/**
 * Interface representing a base navigation item.
 */
export interface NavigationItemBase {
  /** Link of the navigation item. */
  link: NavigationLink

  /** Kind of the navigation item. */
  kind: NavigationItemKind
}
