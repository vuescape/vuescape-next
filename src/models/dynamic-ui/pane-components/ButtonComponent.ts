import type { ButtonComponentPayload } from './ButtonComponentPayload'

/**
 * Represents a button component in the dynamic UI.
 */
export interface ButtonComponent {
  /** The type of the component, which is always 'button'. */
  type: 'button'

  /** The payload associated with the button component. */
  payload: ButtonComponentPayload
}
