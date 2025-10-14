import type { DownloadActionPayload } from './DownloadActionPayload'

/**
 * Represents an action to download a file.
 */
export interface DownloadAction {
  /** The type of action, which is always 'action.download' in order to identify this type. */
  typeName: 'action.download'

  /** The payload containing download details. */
  payload: DownloadActionPayload
}
