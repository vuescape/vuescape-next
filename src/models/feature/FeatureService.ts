import type { Chiclet, Feature, FeatureNavigationRegistration, Menu } from '..'
import type { Router } from 'vue-router'

/**
 * Interface representing a feature service.
 */
export interface FeatureService {
  /**
   * Fetches data, with an optional force load parameter.
   * @param [forceLoad] - Determines whether to force load the data.
   * @returns A promise that resolves when the data is fetched.
   */
  fetch(forceLoad?: boolean): Promise<void>

  /**
   * Gets feature navigation registrations.
   * @returns A promise that resolves with an array of feature navigation registrations.
   */
  getFeatureNavigationRegistrations(): Promise<Array<FeatureNavigationRegistration>>

  /**
   * Gets features.
   * @returns A promise that resolves with an array of features.
   */
  getFeatures(): Promise<Array<Feature>>

  /**
   * Gets a feature by its ID.
   * @param featureId - The ID of the feature to retrieve.
   * @returns A promise that resolves with the feature, or undefined if no feature is found.
   */
  getFeature(featureId: string): Promise<Feature | undefined>

  /**
   * Gets menus with their title paths.
   * @returns A promise that resolves with an array of menus and their title paths.
   */
  getMenus(): Promise<Array<Menu & { menuTitlePath: string }>>

  /**
   * Gets chiclets based on the router.
   * @param router - The router to use for getting chiclets.
   * @returns A promise that resolves with an array of chiclets.
   */
  getChiclets(router: Router): Promise<Array<Chiclet>>
}
