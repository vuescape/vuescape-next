import type { ComputedRef, Ref } from 'vue'
import type { WizardContext } from './WizardContext'
import type { WizardNode } from './WizardNode'

/**
 * Represents the engine that drives the wizard functionality.
 */
export interface WizardEngine {
  /**
   * A reference to the ID of the current step in the wizard.
   */
  currentStepId: Ref<string>

  /**
   * A computed reference to the current wizard node.
   */
  currentNode: ComputedRef<WizardNode>

  /**
   * A computed reference to the properties associated with the current step.
   */
  props: ComputedRef<Record<string, any>>

  /**
   * A computed reference indicating whether the current step is the last step in the wizard.
   */
  isLastStep: ComputedRef<boolean>

  /**
   * Advances the wizard to the next step.
   */
  goNext: () => void

  /**
   * Moves the wizard back to the previous step.
   */
  goBack: () => void
  
  /**
   * Updates the state of a specific step in the wizard.
   *
   * @param stepId - The ID of the step to update.
   * @param payload - The data to update the step with.
   */
  updateStepState: (stepId: string, payload: any) => void

  /**
   * The context of the wizard, containing shared data and functionality.
   */
  context: WizardContext
}
