import type { Action } from '../actions/Action'

/**
 * Represents the payload for a button component in the dynamic UI.
 */
export interface ButtonComponentPayload {
  /**
   * Unique identifier for the button component.
   */
  id: string

  /**
   * The label text to display on the button.
   */
  label: string

  /**
   * The action to be performed when the button is clicked.
   */
  action: Action

  /**
   * Optional array of icon names to display on the button.
   */
  icons?: Array<string>
}
