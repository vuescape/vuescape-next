// src/models/ComponentProps/TableProps.ts
export interface TableProps {
  columns: Array<{ header: string; field: string }>
  rows: Array<Record<string, any>>
}
