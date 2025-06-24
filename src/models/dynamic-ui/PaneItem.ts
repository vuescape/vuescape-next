import type { PaneComponent } from './pane-components/PaneComponent'

/**
 * Represents an item within a pane, which can contain various components and layout properties.
 */
export interface PaneItem {
  /**
   * Flexbox width, e.g., "30%", "grow".
   */
  width?: string

  /**
   * Horizontal alignment of content within the item.
   * Can be 'left', 'center', or 'right'.
   */
  horizontalAlignment?: 'left' | 'center' | 'right'

  /**
   * Vertical alignment of content within the item.
   * Can be 'top', 'middle', or 'bottom'.
   */
  verticalAlignment?: 'top' | 'middle' | 'bottom'

  /**
   * Components to display in the item.
   */
  components: Array<PaneComponent>
}
