import type { WizardEngine } from '../wizard/WizardEngine'

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
   * Text for the button to navigate to the previous step.
   */
  backButtonText?: string

  /**
   * Text for the button to navigate to the next step.
   */
  nextButtonText?: string

  /**
   * Whether the cancel button should be displaed.
   */
  shouldShowCancelButton?: boolean

  /**
   * Text for the button of the last step.
   */
  lastButtonText?: string

  /**
   * Optional reference to the state of the wizard steps.
   */
  wizardStepState?: Record<string, any>

  /**
   * Optional maximum container width CSS expression. Defaults to '1070px'.
   */
  maxContainerWidth?: string
}
