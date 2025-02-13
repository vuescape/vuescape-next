/* eslint-disable require-await */ // -- all functions are noops
import type { Router } from 'vue-router'

import type { Feature, FeatureNavigationRegistration, FeatureService } from '.'
import type { Menu } from '../Menu'
import type { Chiclet } from '../Chiclet'

export class NullFeatureService implements FeatureService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async fetch(forceLoad?: boolean): Promise<void> {
    // noop
  }

  public async getFeatureNavigationRegistrations(): Promise<Array<FeatureNavigationRegistration>> {
    return []
  }

  public async getFeatures(): Promise<Array<Feature>> {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getFeature(featureId: string): Promise<Feature | undefined> {
    return undefined
  }

  public async getMenus(): Promise<Array<Menu & { menuTitlePath: string }>> {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getChiclets(router: Router): Promise<Array<Chiclet>> {
    return []
  }
}
