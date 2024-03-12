import type { RouteLocationNormalized } from 'vue-router'

import type { TrackingProvider } from './TrackingProvider'
import type { TrackingService } from './TrackingService'

export class DefaultTrackingService implements TrackingService {
  private trackingProviders: Array<TrackingProvider>

  constructor(...trackingProviders: Array<TrackingProvider>) {
    if (trackingProviders.length === 0) {
      throw new Error('trackingProviders must not be empty')
    }
    this.trackingProviders = trackingProviders
  }

  public initializeProvider(): void {
    this.trackingProviders.forEach(_ => _.init())
  }

  public identifyUser(user: any): void {
    // Most tracking services expect a string ID but this default implementation
    // passes in the user.  If user is a string this should probably be OK but
    // if user is an object then a custom TrackingService probably needs to be created
    // to extract the user ID.
    this.trackingProviders.forEach(_ => _.identify(user))
  }

  public handleRouteChanged(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
    this.trackingProviders.forEach(_ => _.trackPageView(to.path))
  }

  public getTrackingProvider(name?: string): TrackingProvider | undefined {
    const nameToFind = name || this.trackingProviders[0].name
    const result     = this.trackingProviders.find(_ => _.name === nameToFind)
    return result
  }
}
