import type { TextLinkComponentPayload } from './TextLinkComponentPayload'

/**
 * Represents a text link component in the dynamic UI.
 */
export interface TextLinkComponent {
  /** The type of the component, which is always 'textLink'. */
  type: 'textLink'

  /** The payload associated with the text link component. */
  payload: TextLinkComponentPayload
}
