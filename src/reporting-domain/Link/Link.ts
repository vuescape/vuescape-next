import type { CssStyles } from '../../reporting-domain/Css'
import type { LinkTarget } from './LinkTarget'
import type { ResourceKind } from './ResourceKind'

/**
 * Interface representing a Link.
 */
export interface Link {
  /** The source of the link. */
  source: string

  /** The target of the link. */
  linkTarget: LinkTarget

  /** The title of the link. */
  title: string

  /** The CSS styles activated for the link. Optional. */
  activatedCssStyles?: CssStyles

  /** The kind of resource the link points to. */
  resourceKind: ResourceKind
}
