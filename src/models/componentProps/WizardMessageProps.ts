/**
 * Represents the properties for a wizard message component.
 */
export interface WizardMessageProps {
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
   * Optional button text. If falsy then button will not be rendered.
   * @default undefined
   */
  buttonText?: string

  /**
   * Optional callback function triggered on click.
   * @default undefined
   */
  onclick?: () => void
}
