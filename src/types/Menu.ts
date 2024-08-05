import { HorizontalAlignment } from '@/reporting-domain'

/**
 * Interface representing a Menu.
 */
export interface Menu {
  /** A unique id such as a GUID for the Menu. */
  id: string

  /** The title of the Menu. */
  title: string

  /** The CSS class of the Menu. Optional. */
  cssClass?: string

  /** The aria label of the Menu. Optional. */
  ariaLabel?: string

  /** The icon of the Menu. Optional. */
  icon?: string

  /** The path of the Menu. */
  path: string

  /** The items of the Menu. Optional. */
  items?: Array<Menu>

  /** Indicates whether the Menu is a divider. Optional. */
  isDivider?: boolean

  /** The horizontal alignment of the Menu. Optional. */
  horizontalAlignment?: HorizontalAlignment

  /** Indicates whether the Menu should fire a click event. Optional. */
  shouldFireClickEvent?: boolean

  /** The image source of the Menu. Optional. */
  imageSrc?: string

  /**
   * The path that should be considered active when the actual route in the browser differs from the Menu path.
   * If not specified the path is used to determine if a route is active. Optional.
   */
  pathIsActiveWhen?: string
}
