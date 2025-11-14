import type { WizardEngine } from '../wizard/WizardEngine'
import type { ButtonConfig } from '../wizard/ButtonConfig'

/**
 * Properties for the StepWizard component.
 */
export interface StepWizardShellProps {
  /**
   * The wizard engine.
   */
  engine: WizardEngine

  /**
   * Optional title for the wizard.
   */
  title?: string

  /**
   * Optional help URL for the help documentation.
   */
  helpCenterUrl?: string

  /**
   * Optional reference to the state of the wizard steps.
   */
  wizardStepState?: Record<string, any>

  /**
   * Optional maximum container width CSS expression. Defaults to '1070px'.
   */
  maxContainerWidth?: string

  /**
   * Optional default button configuration for all wizard steps.
   * Can be overridden by individual step buttonConfig.
   */
  defaultButtonConfig?: ButtonConfig
}
