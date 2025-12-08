import type { IconPosition } from './IconPosition'

/**
 * Interface for VuescapeButton props.
 */
export interface VuescapeButtonProps {
  /**
   * The label text for the button.
   * @default 'Submit'
   */
  label?: string

  /**
   * The icon name or path for the button.
   * @default ''
   */
  icon?: string

  /**
   * The position of the icon relative to the label.
   * @default ''
   */
  iconPos?: IconPosition

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean

  /**
   * Additional CSS classes for the button.
   * Can be a string or an object.
   * @default ''
   */
  cssClass?: string | object

  /**
   * Whether the button is outlined.
   * @default false
   */
  outlined?: boolean

  /**
   * The size variant of the button.
   * @optional
   * @default 'default'
   */
  size?: 'default' | 'small'
}
