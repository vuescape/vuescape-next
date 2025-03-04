import type { VuescapeSelectProps } from './VuescapeSelectProps'

/**
 * Interface representing the properties for the WizardSelect component.
 */
export interface WizardSelectProps {
  /**
   * The title of the wizard select component.
   * @default undefined
   */
  title?: string

  /**
   * The prompt text to be displayed in the wizard select component.
   * @default undefined
   */
  promptText?: string

  /**
   * The properties for the Vuescape select component.
   */
  selectProps: VuescapeSelectProps
}
