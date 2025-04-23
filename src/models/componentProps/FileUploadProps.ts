/**
 * Properties for the FileUpload component.
 */
export interface FileUploadProps {
  id: string
  isRequired: boolean
  maxFileSizeInBytes?: number  
  title?: string
  acceptFileTypeExtensions?: Array<string>
  uploadInstructionText?: string
}
