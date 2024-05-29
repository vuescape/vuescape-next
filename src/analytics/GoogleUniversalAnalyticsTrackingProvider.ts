import type { TrackingProvider } from './TrackingProvider'

// tslint:disable-next-line: ban-types
declare var ga: Function

/**
 * Google Universal Analytics Tracking Provider.
 * Implements the TrackingProvider interface.
 */
export class GoogleUniversalAnalyticsTrackingProvider implements TrackingProvider {
  private trackingId: string
  private isInitialized = false

  /**
   * Creates a new instance of the GoogleAnalytics4TrackingProvider.
   * @param trackingId - The tracking ID for Google Analytics.
   */
  constructor(trackingId: string) {
    this.trackingId = trackingId
  }

  /**
   * Gets the name of the tracking provider.
   * @returns The name of the tracking provider.
   */
  public get name() {
    return 'google-universal-analytics'
  }

  /**
   * Identifies the user.
   * @param user - The user to identify.
   */
  // @ts-ignore-once: TS6133
  public identify(user: string): void {
    // Not using Google Analytics to identify so just init the provider
    this.init()
  }

  /**
   *  Initializes the tracking provider.
   */
  public init(): void {
    if (!this.isInitialized) {
      const script = document.createElement('script')
      script.type  = 'text/javascript'
      script.text  = `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', '${this.trackingId}', 'auto');`

      document.head.appendChild(script)
      this.isInitialized = true
    }
  }

  /**
   * Tracks the page view.
   * @param urlFragment - The URL fragment of the page view.
   */
  public trackPageView(urlFragment: string): void {
    if (this.isInitialized) {
      ga('set', 'page', urlFragment)
      ga('send', 'pageview')
    }
  }

  /**
   * Sends an event.
   * @param eventName - The name of the event.
   * @param payload - The payload of the event.
   */
  public sendEvent(eventName: string, payload: any): void {
    ga('send', eventName, ...payload)
  }
}
