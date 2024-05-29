/**
 * Tracking Provider interface.
 * This interface defines the methods that a tracking provider should implement.
 * It includes methods to initialize the provider, identify the user, track page views, and send events.
 */
export interface TrackingProvider {
  /**
   * The name of the tracking provider.
   */
  readonly name: string

  /**
   * Initializes the tracking provider.
   */
  init(): void

  /**
   * Identifies the user.
   * @param user - The user to identify.
   */
  identify(user: string): void

  /**
   * Tracks the page view.
   * @param urlFragment - The URL fragment of the page view.
   */
  trackPageView(urlFragment: string): void

  /**
   * Sends an event.
   * @param eventName - The name of the event.
   * @param payload - The payload of the event.
   */
  sendEvent(eventName: string, payload: any): void
}
