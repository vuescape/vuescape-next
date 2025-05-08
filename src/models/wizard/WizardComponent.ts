import type { DefineComponent } from 'vue'
import type { WizardComponentEmits } from './WizardComponentEmits'

/**
 * Represents a Vue component type definition for a wizard component.
 *
 * @template Props - The type of the props that the wizard component accepts. Defaults to `any`.
 *
 * This type is based on `DefineComponent` and includes the following:
 * - `Props`: The props that the component accepts.
 * - `Record<string, unknown>`: Represents raw bindings, typically an empty object in TypeScript type definitions.
 * - `unknown`: Represents the data, not used in `defineComponent` type definitions in TypeScript.
 * - `{}`: Represents computed properties, defined as an empty object.
 * - `{}`: Represents methods, defined as an empty object.
 * - `{}`: Represents mixin extensions, defined as an empty object.
 * - `WizardComponentEmits<Props>`: Represents the emits configuration for the wizard component.
 */
export type WizardComponent<Props = any> = DefineComponent<
  // Props
  Props,
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
  // Emits
  WizardComponentEmits<Props>
>
