import type { Component, Raw } from 'vue'
import type { z } from 'zod'

/**
 * Represents a step in a wizard.
 */
export interface WizardStep {
  /**
   * The unique ID of the step.
   */
  id: string;

  /**
   * Label shown in the wizard step indicator.
   */
  label: string;

  /**
   * The component to render for this step.
   * @remarks
   * TODO: Update typing here to enforce any requirements for a wizard step component.
   * e.g. can support the change event, etc.
   * At the same time it would be nice to use any component in the wizard so maybe this is good enough?
   */
  component: Raw<Component>;

  /**
   * The payload or any other data the step might need.
   */
  payload?: unknown;

  /**
   * A Zod schema the child component can use for local validation.
   * For example, you can pass this to the child's props so it
   * can call zodSchema.safeParse(formData).
   */
  validationSchema?: z.Schema<any>;

  /**
   * A function that the wizard can call (or the step can call)
   * to do final step-level validation. In some designs, you might
   * rely solely on the zodSchema and not need this. But it's
   * kept here if you want an explicit callback.
   */
  onValidate?: (data: unknown) => boolean | Promise<boolean>;
}
