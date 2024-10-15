import type { NavigationItemBase } from '..'

/**
 * Interface representing a feature navigation registration.
 */
export interface FeatureNavigationRegistration {
  /** The ID of the feature navigation registration. */
  id: string

  /** The ID of the feature. */
  featureId: string

  /** An array of navigation items. */
  navigationItems: Array<NavigationItemBase>
}
