import type { WizardContext } from './WizardContext'

/**
 * Button position within the wizard button bar
 */
export type ButtonPosition = 'left' | 'center' | 'right'

/**
 * Button style variants (predefined "flavors")
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outlined'

/**
 * Configuration for an individual button
 */
export interface ButtonDefinition {
  /** Whether the button should be visible */
  visible?: boolean
  /** Position of the button in the button bar */
  position?: ButtonPosition
  /** Button label text */
  label?: string
  /** Button style variant */
  variant?: ButtonVariant
  /** Whether the button is disabled */
  disabled?: boolean
}

/**
 * Complete button configuration for a wizard step
 */
export interface ButtonConfig {
  /** Configuration for the previous/back button */
  previous?: ButtonDefinition
  /** Configuration for the next/continue button */
  next?: ButtonDefinition
  /** Configuration for the cancel button */
  cancel?: ButtonDefinition
}

/**
 * Button configuration that can be static or dynamic based on wizard context
 */
export type WizardButtonConfig = ButtonConfig | ((ctx: WizardContext) => ButtonConfig)

/**
 * Default button configuration for wizard steps
 * Provides a standard layout with sensible defaults
 */
export const DEFAULT_BUTTON_CONFIG: ButtonConfig = {
  previous: {
    visible: true,
    position: 'left',
    label: 'Back',
    variant: 'primary',
  },
  next: {
    visible: true,
    position: 'right',
    label: 'Next',
    variant: 'primary',
    disabled: false
  },
  cancel: {
    visible: true,
    position: 'center',
    label: 'Cancel',
    variant: 'outlined',
    disabled: false
  }
}
