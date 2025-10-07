import type { PaneComponent } from '../../dynamic-ui/pane-components/PaneComponent'

/**
 * Base interface for all component data emitted from components
 */
export interface ComponentData {
  componentType: PaneComponent['typeName']
}
