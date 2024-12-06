import type { Action } from './actions/Action'

/**
 * Represents a Chiclet component in the dynamic UI.
 */
export interface Chiclet {
  /**
   * The unique identifier for the chiclet.
   */
  id: string

  /**
   * The title of the chiclet.
   */
  title: string

  /**
   * Indicates whether the chiclet is visible.
   */
  isVisible: boolean

  /**
   * Optional array of icon names associated with the chiclet.
   */
  icons?: Array<string>

  /**
   * Optional CSS class to apply to the chiclet.
   */
  cssClass?: string

  /**
   * The action associated with the chiclet.
   */
  action: Action
}
