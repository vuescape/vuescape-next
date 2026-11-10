/**
 * The report format the original Vuescape tree table renders, as an API serves it: what vuescape-dotnet's
 * ConvertToVuescapeReport makes from an OBeautifulCode report. Only the parts that toReportLayout reads are described.
 * Enum values are serialized as camelCase strings.
 */
export interface LegacyReport {
  id: string
  title?: string | null
  sections: Array<LegacySection>
  /** A line shown beside the report, e.g. "As Of: ..." */
  additionalReportInfo?: string | null
  downloadLinks?: Array<LegacyLink> | null
}

export interface LegacySection {
  id: string
  title?: string | null
  name?: string | null
  treeTable: LegacyTreeTable
}

export interface LegacyTreeTable {
  /** One per column */
  columnDefinitions: Array<LegacyColumnDefinition>
  content: {
    headers?: Array<LegacyHeaderRow> | null
    rows?: Array<LegacyRow> | null
    footers?: Array<LegacyRow> | null
    /**
     * Classes for the table, separated by spaces: 'cell-border' (a line around every cell), with 'row-border' (lines
     * between the rows only) or 'no-border' (no lines) beside it for other borders
     */
    cssClass?: string | null
  }
}

export interface LegacyColumnDefinition {
  /** e.g. 'dynamicallySizeToContent', or 'useSpecifiedWidth' with a width */
  columnWidthBehavior?: string | null
  /** In pixels, the only unit vuescape-dotnet gives a width in */
  width?: number | null
  isFrozen: boolean
}

/**
 * A row has a cell for every column. A cell spanning several columns is followed by hidden cells for the columns it
 * covers, so a cell's index is its column's.
 */
export interface LegacyHeaderRow {
  cells: Array<LegacyHeaderCell>
}

export interface LegacyHeaderCell {
  displayValue?: string | null
  /** Absent from a cell covered by an earlier cell's span, which is still marked visible */
  colspan?: number | null
  isVisible: boolean
  /** Present when the column can be sorted */
  columnSorter?: object | null
}

export interface LegacyRow {
  cells: Array<LegacyCell>
  /**
   * False for a row the original table doesn't show, though it shows the row's children and summary rows, e.g. the
   * row a Who Is In report puts its organizations and totals under
   */
  isVisible?: boolean
  isExpanded?: boolean
  children?: Array<LegacyRow> | null
  /**
   * Rows that follow the children while the row is expanded, e.g. totals. vuescape-dotnet moves a table's only row's
   * summary rows to the footer rows instead.
   */
  expandedSummaryRows?: Array<LegacyRow> | null
}

export interface LegacyCell {
  displayValue?: string | null
  /** Absent from a cell covered by an earlier cell's span, which is still marked visible */
  colspan?: number | null
  isVisible: boolean
  /** Keyed by link name. A cell's own link is named '__vs-self'. */
  links?: Record<string, LegacyLink> | null
  slots?: {
    slotNameToUiObjectMap: Record<string, { value: unknown; uiObjectType?: string }>
    defaultSlotName: string
  } | null
  /**
   * Classes separated by spaces, e.g. 'font-weight__bold'. An API on a vuescape-dotnet without the cell format's font
   * options gives them only here.
   */
  cssClasses?: string | null
  cellFormat?: {
    fontHexColor?: string | null
    /** e.g. '12px' */
    fontSizeInPixels?: string | null
    backgroundHexColor?: string | null
    horizontalAlignment?: 'unknown' | 'left' | 'center' | 'right' | null
    isBold?: boolean
    isItalic?: boolean
    isUnderlined?: boolean
  } | null
}

export interface LegacyLink {
  source: string
  /** A LinkTarget value, e.g. 'centerPane' or 'download' */
  linkTarget: string
  /** e.g. 'report', 'excel', 'csv' */
  resourceKind: string
  title?: string | null
}
