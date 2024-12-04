import type { RouteLocationNormalized } from 'vue-router'

import type { TrackingProvider } from './TrackingProvider'
import type { TrackingService } from './TrackingService'

/**
 * Null Tracking Service.
 * This class implements the TrackingService interface.
 * It provides methods to initialize the provider, identify the user, handle route changes, and get the tracking provider.
 * However, all these methods are no-ops.
 */
export class NullTrackingService implements TrackingService {
  /**
   * Initializes the tracking provider.
   * This is a no-op in this implementation.
   */
  public initializeProvider(): void {
    // no-op
  }

  /**
   * Identifies the user.
   * This is a no-op in this implementation.
   * @param user - The user to identify.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public identifyUser(user: any): void {
    // no-op
  }

  /**
   * Handles route changes.
   * This is a no-op in this implementation.
   * @param to - The new route.
   * @param from - The previous route.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleRouteChanged(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
    // no-op
  }

  /**
   * Gets the tracking provider.
   * This is a no-op in this implementation.
   * @param [name] - The name of the tracking provider. If not provided, returns undefined.
   * @returns The tracking provider, or undefined if not found.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getTrackingProvider(name?: string): TrackingProvider | undefined {
    return undefined
  }
}
