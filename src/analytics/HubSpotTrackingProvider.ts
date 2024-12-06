import type { TrackingProvider } from './TrackingProvider'

/**
 * HubSpot Tracking Provider.
 * This class implements the TrackingProvider interface.
 * It provides methods to initialize the provider, identify the user, track page views, and send events.
 */
export class HubSpotTrackingProvider implements TrackingProvider {
  private readonly hubId: string
  private isInitialized = false

  /**
   * Creates a new instance of the GoogleAnalytics4TrackingProvider.
   * @param hubId - The tracking ID for Google Analytics.
   */
  constructor(hubId: string) {
    this.hubId = hubId
  }

  /**
   * Gets the name of the tracking provider.
   * @returns The name of the tracking provider.
   */
  public get name() {
    return 'hubspot-tracking'
  }

  /**
   * Identifies the user.
   * @param user - The user to identify.
   */
  public identify(user: string): void {
    if (!this.isInitialized) {
      this.getHsq().push([
        'identify',
        {
          email: user
        }
      ])

      this.init()
    }
  }

  /**
   *  Initializes the tracking provider.
   */
  public init(): void {
    // Only init once
    if (!this.isInitialized) {
      const script = document.createElement('script')
      script.setAttribute('src', `//js.hs-scripts.com/${this.hubId}.js`)
      script.setAttribute('type', 'text/javascript')
      script.async = true
      script.defer = true

      document.head.appendChild(script)

      this.isInitialized = true
    }
  }

  /**
   * Tracks the page view.
   * @param urlFragment - The URL fragment of the page view.
   */
  public trackPageView(urlFragment: string): void {
    // Only track pages once the user is known
    if (this.isInitialized) {
      const hsq = this.getHsq()
      hsq.push(['setPath', urlFragment])
      hsq.push(['trackPageView', true])
    } else {
      const self = this
      const callback = () => self.trackPageView(urlFragment)
      setTimeout(callback, 500)
      console.warn(
        'HubSpotTrackingProvider.trackPageView: HubSpot is not initialized. Page view not tracked.'
      )
    }
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

  private getHsq(): Array<any> {
    const hsq = ((window as any)._hsq = (window as any)._hsq || [])
    return hsq
  }
}
