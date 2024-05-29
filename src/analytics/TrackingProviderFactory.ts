import { GoogleAnalytics4TrackingProvider } from './GoogleAnalytics4TrackingProvider'
import { GoogleUniversalAnalyticsTrackingProvider } from './GoogleUniversalAnalyticsTrackingProvider'
import { HubSpotTrackingProvider } from './HubSpotTrackingProvider'
import { NullTrackingProvider } from './NullTrackingProvider'

/**
 * Tracking Provider Factory.
 * This class provides a static method to get a tracking provider based on its name and tracking ID.
 */
export class TrackingProviderFactory {
  /**
   * Gets a tracking provider based on its name and tracking ID.
   * If the provided name does not match any of the supported providers, it throws an error.
   *
   * @param name - The name of the tracking provider.
   * @param trackingId - The tracking ID of the tracking provider.
   * @returns The tracking provider.
   * @throws If the provided name does not match any of the supported providers.
   */
  public static getTrackingProvider(name: string, trackingId: string) {
    const hubSpotTrackingProvider = new HubSpotTrackingProvider(trackingId)
    if (name === hubSpotTrackingProvider.name) {
      return hubSpotTrackingProvider
    }

    const googleAnalytics4TrackingProvider = new GoogleAnalytics4TrackingProvider(trackingId)
    if (name === googleAnalytics4TrackingProvider.name) {
      return googleAnalytics4TrackingProvider
    }

    const googleUniversalAnalyticsTrackingProvider = new GoogleUniversalAnalyticsTrackingProvider(trackingId)
    if (name === googleUniversalAnalyticsTrackingProvider.name) {
      return googleUniversalAnalyticsTrackingProvider
    }

    const nullTrackingProvider = new NullTrackingProvider()
    if (name === nullTrackingProvider.name) {
      return nullTrackingProvider
    }

    throw new Error('Unsupported tracking provider name: ' + name)
  }
}
