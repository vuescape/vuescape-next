import type { WizardComponent } from './WizardComponent'
import type { WizardContext } from './WizardContext'

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
   * A function that determines the ID of the next wizard node to navigate to
   * based on the current wizard context.
   *
   * @param ctx - The current context of the wizard.
   * @returns The ID of the next wizard node, or `null` if there is no next node.
   */
  next: (ctx: WizardContext) => string | null
}
