import type { PaneItem } from './PaneItem'

/**
 * Represents a section within a pane, containing multiple items.
 */
export interface PaneSection {
  /**
   * The unique identifier for the pane section.
   */
  id: string

  /**
   * The list of items contained within the pane section.
   */
  items: Array<PaneItem>
}
