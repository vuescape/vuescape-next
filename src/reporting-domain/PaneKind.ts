/**
 * Enum representing a PaneKind.
 * TODO: Duplicates ReportPaneKind in src/types/feature/ReportPaneKind.ts
 * Can this be merged?
 */
export enum PaneKind {
  /** Represents no pane kind. */
  None,

  /** Represents navigation pane kind. */
  Navigation,

  /** Represents main pane kind. */
  Main,

  /** Represents detail pane kind. */
  Detail,
}
