import type { RouteLocationNormalized } from 'vue-router'

import type { TrackingProvider } from './TrackingProvider'
import type { TrackingService } from './TrackingService'

/** Represents the default tracking service. */
export class DefaultTrackingService implements TrackingService {
  private trackingProviders: Array<TrackingProvider>

  /**
   * Creates a new instance of the DefaultTrackingService.
   * @param trackingProviders - The tracking providers.
   */
  constructor(...trackingProviders: Array<TrackingProvider>) {
    if (trackingProviders.length === 0) {
      throw new Error('trackingProviders must not be empty')
    }
    this.trackingProviders = trackingProviders
  }

  /** Initializes the tracking providers. */
  public initializeProvider(): void {
    this.trackingProviders.forEach(_ => _.init())
  }

  /**
   * Identifies the user.
   * @param user - The user to identify.
   */
  public identifyUser(user: any): void {
    this.trackingProviders.forEach(_ => _.identify(user))
  }

  /**
   * Handles the route change.
   * @param to - The new route.
   * @param from - The previous route.
   */
  public handleRouteChanged(to: RouteLocationNormalized, // @ts-ignore-once: TS6133 unused parameter
                            from: RouteLocationNormalized): void {
    this.trackingProviders.forEach(_ => _.trackPageView(to.path))
  }

  /**
   * Gets the tracking provider.
   * @param name - The name of the tracking provider.
   * @returns The tracking provider.
   */
  public getTrackingProvider(name?: string) {
    const nameToFind = name || this.trackingProviders[0].name
    const result = this.trackingProviders.find(_ => _.name === nameToFind) as TrackingProvider
    return result
  }
}
