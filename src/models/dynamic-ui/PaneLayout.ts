import type { PaneSection } from './PaneSection'

/**
 * Represents the layout of a pane, including its sections.
 */
export interface PaneLayout {
  /**
   * The unique identifier for the pane layout.
   */
  id: string

  /**
   * An array of sections within the pane layout.
   */
  sections: Array<PaneSection>
}
