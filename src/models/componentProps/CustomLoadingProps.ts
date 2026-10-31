/**
 * Interface for CustomLoading component props.
 */
export interface CustomLoadingProps {
  /**
   * Determines whether the loading indicator is visible.
   * @default false
   */
  isVisible: boolean

  /**
   * Covers dialogs as well as the page. Needed only for a spinner sent to the body for a dialog's own loading (e.g.
   * by a Teleport): one inside a dialog, as v-loading adds, already covers it.
   * @default false
   */
  shouldCoverDialogs?: boolean
}
