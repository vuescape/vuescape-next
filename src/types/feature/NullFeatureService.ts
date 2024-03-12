import type { Router } from 'vue-router'

import type { Chiclet } from '../Chiclet'
import type { Menu } from '../Menu'

import type { Feature } from './Feature'
import type { FeatureNavigationRegistration } from './FeatureNavigationRegistration'
import type { FeatureService } from './FeatureService'

export class NullFeatureService implements FeatureService {
  public async fetch(forceLoad?: boolean): Promise<void> {
    // noop
  }

  public async getFeatureNavigationRegistrations(): Promise<Array<FeatureNavigationRegistration>> {
    return []
  }

  public async getFeatures(): Promise<Array<Feature>> {
    return []
  }

  public async getFeature(featureId: string): Promise<Feature | undefined> {
    return undefined
  }

  public async getMenus(): Promise<(Array<Menu & { menuTitlePath: string }>)> {
    return []
  }

  public async getChiclets(router: Router): Promise<Array<Chiclet>> {
    return []
  }
}
