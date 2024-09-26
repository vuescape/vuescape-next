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
   * Indicates whether to show the footer.
   * @default true
   */
  showFooter?: boolean
}
