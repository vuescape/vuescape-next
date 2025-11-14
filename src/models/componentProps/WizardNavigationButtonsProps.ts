import type { ButtonDefinition, ButtonPosition } from '../wizard/ButtonConfig'

/**
 * Properties for the WizardNavigationButtons component.
 */
export interface WizardNavigationButtonsProps {
  /**
   * Buttons grouped by their position (left, center, right).
   * Each position contains an array of button configurations with their type and config.
   */
  buttonsByPosition: Record<ButtonPosition, Array<{ type: 'previous' | 'next' | 'cancel', config: ButtonDefinition }>>
}
