import type { DefineComponent } from 'vue'

/**
 * Represents a bootstrapped component with provided props.
 */
export interface BootstrappedComponent {
  component: DefineComponent<any, any, any>
  props?: any
}
