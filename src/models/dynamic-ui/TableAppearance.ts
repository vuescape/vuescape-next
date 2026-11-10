import type { TableBorderKind } from './TableBorderKind'

/**
 * How a table looks as a whole, as opposed to the format of its cells.
 */
export interface TableAppearance {
  /**
   * Whether every other row is shaded, to help follow a row across a wide table. A list that is read down rather than
   * across, e.g. a navigation's links, reads better without.
   * @default true
   */
  isStriped?: boolean

  /**
   * The lines that separate the cells.
   * @default 'grid'
   */
  borders?: TableBorderKind
}
