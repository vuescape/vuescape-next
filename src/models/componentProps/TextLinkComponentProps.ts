import type { Action } from '../dynamic-ui/actions/Action'

/**
 * Interface representing the properties for a TextLinkComponent.
 */
export interface TextLinkComponentProps {
  /**
   * Unique identifier for the component.
   */
  id: string

  /**
   * The text to show.
   */
  text: string

  /**
   * The navigation action.
   */
  action: Action

  /**
   * The inline styles of the cell.
   */
  cssStyles?: Record<string, string>

  /**
   * CSS class (or space delimited classes).
   */
  cssClass?: string
}
