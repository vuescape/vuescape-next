import type { FileUploadComponentData } from './FileUploadComponentData'
import type { SelectComponentData } from './SelectComponentData'
// import type { TextInputComponentData } from './TextInputComponentData'

/**
 * Union type of all supported component data types
 */
export type SurveyComponentData = FileUploadComponentData | SelectComponentData
// | TextInputComponentData
