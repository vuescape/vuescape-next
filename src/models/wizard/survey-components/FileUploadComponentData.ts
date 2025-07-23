import type { ComponentData } from "./ComponentData"

/**
 * File upload component data
 */
export interface FileUploadComponentData extends ComponentData {
  componentType: 'fileUpload'
  files: File[]
  isValid: boolean
}
