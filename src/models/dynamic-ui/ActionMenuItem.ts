import type { Action } from './actions/Action'

/**
 * Interface representing a single item in an action menu.
 *
 * ActionMenuItem defines the structure for individual menu items that can be displayed
 * in dropdown menus, context menus, or other action-based UI components.
 * Each item can have a label, associated action, optional payload, icons, and accessibility features.
 */
export interface ActionMenuItem {
  /**
   * The text label displayed for this menu item.
   * This is the primary text that users will see and click on.
   */
  label: string

  /**
   * The action to be executed when this menu item is clicked.
   * Actions define the behavior such as navigation, API calls, or other operations.
   */
  action: Action

  /**
   * Optional array of icon class names to display with this menu item.
   * Icons are typically CSS classes from icon libraries like Font Awesome or PrimeIcons.
   * Multiple icons can be provided for complex menu item states.
   */
  icons?: Array<string>

  /**
   * Position of the icons relative to the label text.
   * - 'left': Icons appear before the label text
   * - 'right': Icons appear after the label text
   */
  iconPosition: 'left' | 'right'

  /**
   * Flag to disable this menu item.
   * When true, the item will be rendered but not clickable and typically styled as disabled.
   */
  isDisabled: boolean

  /**
   * Optional tooltip text to display when hovering over this menu item.
   * Provides additional context or help text for the user.
   */
  tooltip?: string
}
