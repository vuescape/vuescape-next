/**
 * Represents the payload for a download action.
 */
export interface DownloadActionPayload {
  url: string
  shouldResolveDownloadFile?: boolean
}
