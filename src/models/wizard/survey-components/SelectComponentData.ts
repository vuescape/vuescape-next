import type { ComponentData } from './ComponentData'

/**
 * Select component data
 */
export interface SelectComponentData extends ComponentData {
  componentType: 'select'
  selectedValue: any
  isValid?: boolean
}
