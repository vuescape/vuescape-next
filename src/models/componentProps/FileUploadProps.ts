/**
 * Properties for the FileUpload component.
 */
export interface FileUploadProps {
  id: string
  title?: string
  maxFileSizeInBytes?: number
  acceptFileTypeExtensions?: Array<string>
  uploadInstructionText?: string
}
