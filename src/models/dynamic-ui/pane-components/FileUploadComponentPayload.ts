/**
 * Represents the payload for a file upload component in the dynamic UI.
 */
export interface FileUploadComponentPayload {
  id: string
  title?: string
  maxFileSizeInBytes?: number
  acceptFileTypeExtensions?: Array<string>
  uploadInstructionText?: string
}
