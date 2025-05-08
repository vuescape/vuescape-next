import type { WizardState } from './WizardState'

/**
 * Represents the context of a wizard, including its state, current step, history, and a method to update the state.
 */
export interface WizardContext {
  /**
   * The current state of the wizard.
   */
  state: WizardState

  /**
   * The identifier of the current step in the wizard.
   */
  currentStepId: string

  /**
   * A history of step identifiers that have been visited in the wizard.
   */
  history: string[]

  /**
   * Updates the state of the wizard for a specific step.
   *
   * @param stepId - The identifier of the step to update.
   * @param payload - The data to update the state with.
   */
  updateState: (stepId: string, payload: any) => void
}
