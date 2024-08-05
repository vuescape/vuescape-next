import type { LinkedResourceOpBase } from '@/types'

/**
 * Interface representing a feature.
 */
export interface Feature {
  /** The ID of the feature. */
  id: string

  /** An array of operations related to the feature. */
  operations: Array<LinkedResourceOpBase>
}
