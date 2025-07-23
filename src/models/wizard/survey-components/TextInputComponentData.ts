import type { ComponentData } from "./ComponentData"

/**
 * Text input component data
 */
export interface TextInputComponentData extends ComponentData {
  componentType: 'textInput'
  value: string
  isValid?: boolean
}
