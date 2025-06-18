import type { WizardComponent } from './WizardComponent'
import type { WizardContext } from './WizardContext'

/**
 * Represents a step in a wizard flow, encapsulating the Vue component to render,
 * a function to generate its props based on the wizard context, and an optional
 * function to compute a unique hash for the step.
 */
export interface WizardStepComponent<Props = any> {
  /**
   * The Vue component to render for this step.
   */
  component: WizardComponent<Props>

  /**
   * A function to generate the props for the component based on the wizard context.
   */
  props: (ctx: WizardContext) => Props

  /**
   * A function to compute the hash for the step. It receives the `WizardContext`
   * and must invoke the `props` function to compute the hash based on the evaluated props.
   */
  hash?: (ctx: WizardContext, propsFn: (ctx: WizardContext) => Props) => string
}
