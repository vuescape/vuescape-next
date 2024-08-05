import { ColumnWidthBehavior, ColumnWrapBehavior, UnitOfMeasure } from '@/reporting-domain'

/**
 * Interface representing a ColumnDefinition.
 */
export interface ColumnDefinition {
  /** The behavior of the column width. */
  columnWidthBehavior: ColumnWidthBehavior

  /** The behavior of the cell/column wrap. */
  columnWrapBehavior: ColumnWrapBehavior

  /** The width of the column. Optional. */
  width?: number

  /** The unit of measure for the width of the column. Optional. */
  widthUnitOfMeasure?: UnitOfMeasure

  /** Indicates whether the column is frozen. */
  isFrozen: boolean
}
