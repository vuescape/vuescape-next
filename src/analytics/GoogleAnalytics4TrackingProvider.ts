import { addScript, loadScriptFromUrl } from '../infrastructure'
import type { TrackingProvider } from './TrackingProvider'

declare var gtag: Function

/**
 * Google Analytics 4 Tracking Provider.
 * Implements the TrackingProvider interface.
 */
export class GoogleAnalytics4TrackingProvider implements TrackingProvider {
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
    return 'google-analytics-4'
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
      loadScriptFromUrl(`https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`)

      const scriptContent = `
window.dataLayer = window.dataLayer || []
function gtag() { dataLayer.push(arguments) }
gtag('js', new Date())
gtag('config', '${this.trackingId}', { send_page_view: false })
`
      addScript(scriptContent)
      this.isInitialized = true
    }
  }

  /**
   * Tracks the page view.
   * @param urlFragment - The URL fragment of the page view.
   */
  public trackPageView(urlFragment: string): void {
    if (this.isInitialized) {
      gtag('config', `${this.trackingId}`, { page_path: urlFragment })
    }
  }

  /**
   * Sends an event.
   * @param eventName - The name of the event.
   * @param payload - The payload of the event.
   */
  public sendEvent(eventName: string, payload: any): void {
    gtag('send', eventName, ...payload)
  }
}
