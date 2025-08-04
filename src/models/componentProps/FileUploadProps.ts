/**
 * Properties for the FileUpload component.
 */
export interface FileUploadProps {
  id: string
  isRequired: boolean
  maxFileSizeInBytes?: number  
  acceptFileTypeExtensions?: Array<string>
  uploadInstructionText?: string
}
