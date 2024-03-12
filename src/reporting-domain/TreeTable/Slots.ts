import { type UiObject } from '@vuescape/reporting-domain'

export interface Slots {
  activeSlotName: string
  defaultSlotName: string
  slotNameToUiObjectMap: Record<string, UiObject>
}
