import type { FileUploadComponentPayload } from './FileUploadComponentPayload'

/**
 * Represents a button component in the dynamic UI.
 */
export interface FileUploadComponent {
  /** The type of the component, which is always 'fileUpload'. */
  typeName: 'component.fileUpload'

  /** The payload associated with the button component. */
  payload: FileUploadComponentPayload
}
