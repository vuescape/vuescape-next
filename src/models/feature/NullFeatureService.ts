import type { Feature, FeatureNavigationRegistration, FeatureService} from '.'
import type { Router } from 'vue-router'
import type { Menu } from '../Menu'

export class NullFeatureService implements FeatureService {
  // @ts-ignore-once: TS6133
  public async fetch(forceLoad?: boolean): Promise<void> {
    // noop
  }

  public async getFeatureNavigationRegistrations(): Promise<Array<FeatureNavigationRegistration>> {
    return []
  }

  public async getFeatures(): Promise<Array<Feature>> {
    return []
  }

  // @ts-ignore-once: TS6133
  public async getFeature(featureId: string): Promise<Feature | undefined> {
    return undefined
  }

  public async getMenus(): Promise<(Array<Menu & { menuTitlePath: string }>)> {
    return []
  }

  // @ts-ignore-once: TS6133
  public async getChiclets(router: Router): Promise<Array<Chiclet>> {
    return []
  }
}
