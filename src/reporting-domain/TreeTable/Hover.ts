import type { HoverContentKind } from './HoverContentKind'

/**
 * Interface representing rendering response to a Hover over.
 */
export interface Hover {
  /** The title of the hover. Optional. */
  title?: string

  /** The content of the hover. Optional. */
  content?: string

  /** The component of the hover. Optional. */
  component?: string | (() => Promise<any>)

  /** The kind of the hover content. Optional. */
  contentKind?: HoverContentKind
}
