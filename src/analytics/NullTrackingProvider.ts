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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public trackPageView(urlFragment: string): void {
    // no-op
  }

  /**
   * Sends an event.
   * @param eventName - The name of the event.
   * @param payload - The payload of the event.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public sendEvent(eventName: string, payload: any): void {
    // no-op
  }
}
