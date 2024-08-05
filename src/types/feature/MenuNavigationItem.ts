import { HorizontalAlignment } from '@/reporting-domain'
import type { NavigationItemBase } from '@/types'

export interface MenuNavigationItem extends NavigationItemBase {
  menuTitlePath: string
  horizontalAlignment: HorizontalAlignment
  shouldFireClickEvent?: boolean
}
