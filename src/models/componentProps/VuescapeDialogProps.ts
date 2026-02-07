/**
 * Represents the props for the VuescapeDialog component.
 */
export interface VuescapeDialogProps {
  /**
   * Indicates whether the dialog is visible.
   */
  modelValue: boolean

  /**
   * The text to display in the dialog header.
   */
  headerText: string

  /**
   * Determines if the dialog can be closed.
   * @default true
   */
  closable?: boolean

  /**
   * Determines if the dialog can be dragged.
   * @default false
   */
  draggable?: boolean

  /**
   * The text to display on the OK button.
   * @default 'OK'
   */
  okButtonText?: string

  /**
   * The text to display on the cancel button.
   * When provided, a cancel button is shown alongside the OK button.
   */
  cancelButtonText?: string

  /**
   * Controls the layout density of the dialog header and footer.
   * @default 'comfortable'
   */
  density?: 'comfortable' | 'compact'

  /**
   * Indicates whether to show the footer.
   * @default true
   */
  showFooter?: boolean
}
