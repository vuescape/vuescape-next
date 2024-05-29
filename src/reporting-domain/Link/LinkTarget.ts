/**
 * Enum representing the target of a link.
 */
export enum LinkTarget {
  /** No target. */
  None = 0,

  /** Target is the left pane. */
  LeftPane,

  /** Target is the center pane. */
  CenterPane,

  /** Target is the right pane. */
  RightPane,

  /** Target is a modal. */
  Modal,

  /** Target is the current window. */
  CurrentWindow,

  /** Target is a new window. */
  NewWindow,

  /** Target is a download. */
  Download,
}
