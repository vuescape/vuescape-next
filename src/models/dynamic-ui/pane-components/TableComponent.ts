import type { TableComponentPayload } from './TableComponentPayload'

/**
 * Represents a table component in the dynamic UI.
 */
export interface TableComponent {
  /** The type of the component, which is always 'table'. */
  typeName: 'component.table'
  /** The payload containing the data and configuration for the table component. */
  payload: TableComponentPayload
}
