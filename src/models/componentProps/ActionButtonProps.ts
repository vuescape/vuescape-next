import type { ActionMenuItem } from '../dynamic-ui/ActionMenuItem'

/**
 * Props interface for the ActionButton component.
 *
 * ActionButton is a button component that displays a dropdown menu with action items.
 * It supports both left and right icon positioning and can display multiple icons.
 */
export interface ActionButtonProps {
  /**
   * Unique identifier for the button element.
   * Used for accessibility and testing purposes.
   */
  id: string

  /**
   * The text label displayed on the button.
   * This is the primary text that users will see and interact with.
   */
  label: string

  /**
   * Array of menu items that will be displayed in the dropdown menu.
   * Each item can contain actions, labels, and other interactive elements.
   */
  menuItems: Array<ActionMenuItem>

  /**
   * Flag to disable the action button.
   * When true, the button will be rendered in a disabled state and will not be interactive.
   */
  isDisabled: boolean

  /**
   * Optional array of icon class names to display on the button.
   * Icons are typically CSS classes from icon libraries like Font Awesome or PrimeIcons.
   * Multiple icons can be provided for complex button states.
   */
  icons?: Array<string>

  /**
   * Position of the icons relative to the label text.
   * - 'left': Icons appear before the label text
   * - 'right': Icons appear after the label text
   */
  iconPosition: 'left' | 'right'

  /**
   * Optional tooltip text to display when hovering over this menu item.
   * Provides additional context or help text for the user.
   */
  tooltip?: string
}
