/**
 * Represents the properties for a wizard message component.
 */
export interface WizardConfirmationProps {
  /**
   * The title of the wizard select component.
   * @default undefined
   */
  title: string

  /**
   * The message HTML to be displayed
   * @default undefined
   */
  messageHtml: string

  /**
   * Optional confirmation. If falsy then button will not be rendered.
   * @default undefined
   */
  confirmationCheckboxLabel?: string
}
