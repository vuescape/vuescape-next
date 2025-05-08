/**
 * Represents the state of a wizard, where each step is identified by a unique `stepId`.
 * The state for each step can hold any type of data.
 *
 * @remarks
 * This interface uses an index signature to allow dynamic keys representing step IDs.
 * The value associated with each key can be of any type, making it flexible for various use cases.
 *
 * @example
 * const wizardState: WizardState = {
 *   step1: { completed: true, data: { name: "John" } },
 *   step2: { completed: false }
 * };
 */
export interface WizardState {
  /**
   * A dynamic property where the key is the unique identifier of a wizard step,
   * and the value is the state associated with that step. The value can be of any type.
   */
  [stepId: string]: any
}
