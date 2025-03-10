import type { WizardStep } from '../wizard/WizardStep'

/**
 * Properties for the StepWizard component.
 */
export interface StepWizardProps {
  /**
   * An array of steps to be displayed in the wizard.
   */
  steps: Array<WizardStep>

  /**
   * Text for the button to navigate to the previous step.
   */
  previousStepButtonText?: string

  /**
   * Text for the button to navigate to the next step.
   */
  nextStepButtonText?: string

  /**
   * Text for the button to navigate to the last step.
   */
  lastStepButtonText?: string

  /**
   * Optional reference to the state of the wizard steps.
   */
  wizardStepState?: Record<string, any>
}
