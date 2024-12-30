import type { TextComponentPayload } from './TextComponentPayload'

/**
 * Represents a button component in the dynamic UI.
 */
export interface TextComponent {
  /** The type of the component, which is always 'standard-text'. */
  type: 'standard-text'

  /** The payload associated with the text component. */
  payload: TextComponentPayload
}
