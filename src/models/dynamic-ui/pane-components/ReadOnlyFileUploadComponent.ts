import type { FileUploadComponentPayload } from './FileUploadComponentPayload'

/**
 * Represents a readonly file upload component in the dynamic UI.
 */
export interface ReadOnlyFileUploadComponent {
  /** The type of the component, which is always 'readOnlyFileUpload'. */
  type: 'readOnlyFileUpload'

  /** The payload associated with the button component. */
  payload: FileUploadComponentPayload
}
