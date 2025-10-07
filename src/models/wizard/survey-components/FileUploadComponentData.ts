import type { ComponentData } from './ComponentData'

/**
 * File upload component data
 */
export interface FileUploadComponentData extends ComponentData {
  componentType: 'component.fileUpload'
  files: File[]
  isValid: boolean
}
