import { UiObjectType } from './UiObjectType'

/**
 * Interface representing a UiObject.
 */
export interface UiObject {
  /** The value of the UiObject. Can be any value. */
  value: any

  /** The type of the UiObject. */
  uiObjectType?: UiObjectType

  /** The assembly qualified name of the UiObject. */
  assemblyQualifiedName?: string
}
