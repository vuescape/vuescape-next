import type { TrackingProvider } from './TrackingProvider'

/**
 * Null Tracking Provider.
 * This class implements the TrackingProvider interface.
 * It provides methods to initialize the provider, identify the user, track page views, and send events.
 * However, all these methods are no-ops.
 */
export class NullTrackingProvider implements TrackingProvider {
  /**
   * Identifies the user.
   * @param user - The user to identify.
   */
  // @ts-ignore-once: TS6133
  public identify(user: string): void {
    // no-op
  }

  /**
   * Gets the name of the tracking provider.
   * @returns The name of the tracking provider.
   */
  public get name() {
    return 'NullTrackingProvider'
  }

  /**
   *  Initializes the tracking provider.
   */
  public init(): void {
    // no-op
  }

  /**
   * Tracks the page view.
   * @param urlFragment - The URL fragment of the page view.
   */
  // @ts-ignore-once: TS6133
  public trackPageView(urlFragment: string): void {
    // no-op
  }

  /**
   * Sends an event.
   * @param eventName - The name of the event.
   * @param payload - The payload of the event.
   */
  // @ts-ignore-once: TS6133
  public sendEvent(eventName: string, payload: any): void {
    // no-op
  }
}
