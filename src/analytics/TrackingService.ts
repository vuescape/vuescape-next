import type { RouteLocationNormalized } from 'vue-router'

import type { TrackingProvider } from './TrackingProvider'

/**
 * Tracking Service interface.
 * This interface defines the methods that a tracking service should implement.
 * It includes methods to initialize the provider, identify the user, handle route changes, and get the tracking provider.
 */
export interface TrackingService {
  /**
   * Initializes the tracking provider.
   */
  initializeProvider(): void

  /**
   * Identifies the user.
   * @param user - The user to identify.
   */
  identifyUser(user: any): void

  /**
   * Handles route changes.
   * @param to - The new route.
   * @param from - The previous route.
   */
  handleRouteChanged(to: RouteLocationNormalized, from: RouteLocationNormalized): void

  /**
   * Gets the tracking provider.
   * @param [name] - The name of the tracking provider. If not provided, returns the default provider.
   * @returns The tracking provider, or undefined if not found.
   */
  getTrackingProvider(name?: string): TrackingProvider | undefined
}
