// src/models/ComponentProps/TableProps.ts
/**
 * Interface representing the properties for a table component.
 */
export interface TableProps {
  /**
   * An array of objects representing the columns of the table.
   * Each object should contain a `header` which is the display name of the column,
   * and a `field` which is the key corresponding to the data field in the rows.
   */
  columns: Array<{ header: string; field: string }>

  /**
   * An array of objects representing the rows of the table.
   * Each object is a record where the keys are column fields and the values are the corresponding data.
   */
  rows: Array<Record<string, any>>
}
