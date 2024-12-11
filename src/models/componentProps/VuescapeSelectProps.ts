/**
 * Interface representing the properties for the VuescapeSelect component.
 *
 */
export interface VuescapeSelectProps {
  /**
   * The options to display in the select component.
   */
  options: Array<any>

  /**
   * The currently selected value.
   */
  value: any

  /**
   * The name of the select component.
   * @optional
   */
  name?: string

  /**
   * The property of the options object used to display the label in the select component.
   * @optional
   */
  optionLabel?: string

  /**
   * The placeholder text for the select component.
   * @optional
   */
  placeholder?: string

  /**
   * Indicates whether the select component is disabled.
   * @optional
   */
  disabled?: boolean

  /**
   * The CSS class for the select component.
   * @optional
   */
  class?: string
}
