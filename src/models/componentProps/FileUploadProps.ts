/**
 * Properties for the FileUpload component.
 */
export interface FileUploadProps {
  id: string
  title: string
  isRequired: boolean
  maxFileSizeInBytes?: number  
  acceptFileTypeExtensions?: Array<string>
  uploadInstructionText?: string
}
