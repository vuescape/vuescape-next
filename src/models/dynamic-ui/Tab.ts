import type { Badge } from '../dynamic-ui/Badge'

/**
 * Represents a tab in a dynamic UI. N.B. This does not include the tab content itself.
 */
export interface Tab {
  /**
   * A unique identifier for the tab.
   */
  id: string

  /**
   * The label displayed on the tab (e.g. the tab's title).
   */
  label: string

  /**
   * The badge associated with the tab.
   */
  badge?: Badge
}
