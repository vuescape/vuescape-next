import { HorizontalAlignment } from '@vuescape/reporting-domain/TreeTable/HorizontalAlignment'
import type { NavigationItemBase } from './NavigationItemBase'

export interface MenuNavigationItem extends NavigationItemBase {
  menuTitlePath: string
  horizontalAlignment: HorizontalAlignment
  shouldFireClickEvent?: boolean
}
