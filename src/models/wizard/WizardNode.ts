import type { WizardComponent } from './WizardComponent'
import type { WizardContext } from './WizardContext'
import type { WizardButtonConfig } from './ButtonConfig'

/**
 * Represents a node in a wizard flow, defining the component to render,
 * its properties, and the logic for determining the next step.
 */
export interface WizardNode<Props = any> {
  /**
   * A unique identifier for the wizard node.
   */
  id: string

  /**
   * The component to be rendered for this wizard node.
   */
  component: WizardComponent<Props>

  /**
   * A function that generates the properties to be passed to the component
   * based on the current wizard context.
   *
   * @param ctx - The current context of the wizard.
   * @returns A record of properties to be passed to the component.
   */
  props?: (ctx: WizardContext) => Props

  /**
   * An optional custom hash function to determine when the step should re-render.
   *
   * @param ctx - The wizard context.
   * @param props - The current props of this node.
   * @returns A hash value.
   */
  hash?: (ctx: WizardContext, props: Props) => string

  /**
   * A function that determines the ID of the next wizard node to navigate to
   * based on the current wizard context.
   *
   * @param ctx - The current context of the wizard.
   * @returns The ID of the next wizard node, or `null` if there is no next node.
   */
  next: (ctx: WizardContext) => string | null

  /**
   * Optional configuration for the wizard navigation buttons (previous, next, cancel).
   * Can be a static ButtonConfig object or a function that generates the config
   * based on the current wizard context.
   *
   * @param ctx - The current context of the wizard.
   * @returns Button configuration for this step.
   */
  buttonConfig?: WizardButtonConfig
}
