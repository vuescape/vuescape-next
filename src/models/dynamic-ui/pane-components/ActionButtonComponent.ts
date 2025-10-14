import type { ActionButtonComponentPayload } from './ActionButtonComponentPayload'

/**
 * Represents an action button component in the dynamic UI.
 */
export interface ActionButtonComponent {
  /** The type of the component, which is always 'button'. */
  typeName: 'component.actionButton'

  /** The payload associated with the button component. */
  payload: ActionButtonComponentPayload
}
