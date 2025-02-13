/* eslint-disable require-await */ // -- all functions are noops
import type { Router } from 'vue-router'

import type { Feature, FeatureNavigationRegistration, FeatureService } from '.'
import type { Menu } from '../Menu'
import type { Chiclet } from '../Chiclet'

export class NullFeatureService implements FeatureService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async fetchAsync(forceLoad?: boolean): Promise<void> {
    // noop
  }

  public async getFeatureNavigationRegistrationsAsync(): Promise<Array<FeatureNavigationRegistration>> {
    return []
  }

  public async getFeaturesAsync(): Promise<Array<Feature>> {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getFeatureAsync(featureId: string): Promise<Feature | undefined> {
    return undefined
  }

  public async getMenusAsync(): Promise<Array<Menu & { menuTitlePath: string }>> {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getChicletsAsync(router: Router): Promise<Array<Chiclet>> {
    return []
  }
}
