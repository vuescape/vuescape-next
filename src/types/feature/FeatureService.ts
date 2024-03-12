import type { Router } from 'vue-router'

import type { Chiclet } from '../Chiclet'
import type { Menu } from '../Menu'

import type { Feature } from './Feature'
import type { FeatureNavigationRegistration } from './FeatureNavigationRegistration'

export interface FeatureService {
  fetch(forceLoad?: boolean): Promise<void>

  getFeatureNavigationRegistrations(): Promise<Array<FeatureNavigationRegistration>>

  getFeatures(): Promise<Array<Feature>>

  getFeature(featureId: string): Promise<Feature | undefined>

  getMenus(): Promise<Array<Menu & { menuTitlePath: string }>>

  getChiclets(router: Router): Promise<Array<Chiclet>>
}
