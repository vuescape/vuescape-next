import type { ComponentData } from './ComponentData'

/**
 * Select component data
 */
export interface SelectComponentData extends ComponentData {
  componentType: 'component.select'
  selectedValue: any
  isValid?: boolean
}
