import type { PaneComponent } from './pane-components/PaneComponent'

export interface PaneItem {
  width?: string // Flexbox width, e.g., "30%", "flex-grow-1"
  horizontalAlignment?: 'left' | 'center' | 'right' // Horizontal alignment of content within the item
  verticalAlignment?: 'top' | 'middle' | 'bottom' // Vertical alignment of content within the item
  components: Array<PaneComponent> // Components to display in the item
}
