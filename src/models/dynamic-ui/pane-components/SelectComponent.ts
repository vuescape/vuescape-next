import type { SelectComponentPayload } from './SelectComponentPayload'

/**
 * Represents a button component in the dynamic UI.
 */
export interface SelectComponent {
  /** The type of the component, which is always 'select'. */
  type: 'select'

  /** The payload associated with the tab component. */
  payload: SelectComponentPayload
}
