import type { BadgeSeverity } from './BadgeSeverity'

/**
 * Represents a Badge component.
 */
export interface Badge {
  /**
   * The text of the badge.
   */
  text: string

  /** The severity of the badge -- will determine the display color. */
  severity?: BadgeSeverity
}
