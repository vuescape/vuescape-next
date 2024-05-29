import { type UiObject } from '../UiObject'

/**
 * Interface representing Slots.
 */
export interface Slots {
  /** The name of the active slot. */
  activeSlotName: string

  /** The name of the default slot. */
  defaultSlotName: string

  /** A map from slot names to UiObjects. */
  slotNameToUiObjectMap: Record<string, UiObject>
}
