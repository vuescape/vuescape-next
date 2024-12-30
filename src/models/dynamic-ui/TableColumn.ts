export interface TableColumn {
  /**
   * Identifier of a column if field property is not defined.
   */
  id: string
  /**
   * Type of data. It's value is related to PrimeVue.filterMatchModeOptions config.
   */
  dataType?: 'date' | 'numeric' | 'boolean' | string | undefined
  /**
   * Defines if a column is sortable.
   */
  isSortable?: boolean | undefined
  /**
   * Defines the sort mode for the column.
   */
  sortMode?: 'single' | 'multiple' | undefined
  /**
   * Defines if a column is filterable.
   */
  isFilterable?: boolean | undefined
  /**
   * Defines the filter mode for the column.
   */
  filterMode?: 'string' | 'category' | 'date' | 'boolean' | undefined
  /**
   * Header text of the column.
   */
  headerText?: string | undefined
  /**
   * Footer text of the column.
   */
  footerText?: string | undefined
  /**
   * Inline style of header, body and footer cells.
   */
  style?: Record<string, string> | undefined;
  /**
   * Style class of header, body and footer cells.
   */
  cssClass?: any
  /**
   * Inline style of the column header.
   */
  headerStyle?: any
  /**
   * Style class of the column header.
   */
  cssHeaderClass?: any
  /**
   * Inline style of the column body.
   */
  bodyStyle?: any
  /**
   * Style class of the column body.
   */
  cssBodyClass?: any
  /**
   * Inline style of the column footer.
   */
  footerStyle?: any
  /**
   * Style class of the column footer.
   */
  cssFooterClass?: any
  /**
   * Number of columns to span for grouping.
   */
  colspan?: number | undefined
  /**
   * Number of rows to span for grouping.
   */
  rowspan?: number | undefined
  /**
   * Whether the column is fixed in horizontal scrolling.
   */
  isFrozen?: boolean | undefined
  /**
   * Position of a frozen column, valid values are left and right.
   */
  alignFrozen?: 'left' | 'right' | undefined
  /**
   * Whether the column is rendered.
   */
  isHidden?: boolean | undefined
}
