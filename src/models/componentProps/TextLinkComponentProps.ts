import type { NavigationAction } from "../dynamic-ui/actions/NavigationAction"

/**
 * Interface representing the properties for a TextLinkComponent.
 */
export interface TextLinkComponentProps {
  /**
   * The text to show.
   */
  text: string

  /**
   * The navigation action.
   */
  navigationAction: NavigationAction

  /**
   * The inline styles of the cell.
   */
  cssStyles?: Record<string, string>

  /**
   * CSS class (or space delimited classes).
   */
  cssClass?: string
}
