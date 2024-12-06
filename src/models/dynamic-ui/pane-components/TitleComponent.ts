import type { TitleComponentPayload } from './TitleComponentPayload'

/**
 * Represents a title component in the dynamic UI.
 */
export interface TitleComponent {
  /** The type of the component, which is always 'title'. */
  type: 'title'
  /** The payload containing the data for the title component. */
  payload: TitleComponentPayload
}
