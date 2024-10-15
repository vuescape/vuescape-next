import { HorizontalAlignment } from '../../reporting-domain'
import type { NavigationItemBase } from './NavigationItemBase'

export interface MenuNavigationItem extends NavigationItemBase {
  menuTitlePath: string
  horizontalAlignment: HorizontalAlignment
  shouldFireClickEvent?: boolean
}
