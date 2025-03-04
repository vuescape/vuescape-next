import type { DefineComponent, Raw } from 'vue'

/**
 * Describes the props that each WizardStep component might accept
 * from the parent (the StepWizard).
 */
export interface BaseWizardStepProps {
  /**
   * The payload from WizardStep, if needed.
   * Typically, you'll do a typed payload if your steps share a structure,
   * or keep it unknown if each step is quite different.
   */
  payload?: unknown
}


type BaseWizardStepEmits = {
  change?: (data: any) => boolean
}

// TODO: Define the props for the wizard step component. This is a work in progress and was causing errors
// so is not currently being used.

/**
 * We then compose a type for an actual Vue component that implements these.
 */
export type WizardStepComponent = Raw<
  DefineComponent<
    // Props
    unknown,
    // Raw bindings (this is typically an empty object in TS type defs)
    Record<string, unknown>,
    // Data (not used in defineComponent type definitions in TS)
    unknown,
    // Computed
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
    // Methods
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
    // Mixin extends
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
    // Emits (i.e., the event contract)
    BaseWizardStepEmits
  >
>
