/**
 * Enum representing the target of a link.
 */
export enum LinkTarget {
  /** No target. */
  None = 'none',

  /** Target is the current pane. Results in navigation. To avoid navigation target left, center, or right panes. */
  CurrentPane = 'currentPane',

  /** Target is the left pane. */
  LeftPane = 'leftPane',

  /** Target is the center pane. */
  CenterPane = 'centerPane',

  /** Target is the right pane. */
  RightPane = 'rightPane',

  /** Target is a modal. */
  Modal = 'modal',

  /** Target is the current window. */
  CurrentWindow = 'currentWindow',

  /** Target is a new window. */
  NewWindow = 'newWindow',

  /** Target is a download. */
  Download = 'download',

  /** Target is UI navigation without report loading. */
  Navigate = 'navigate'
}
