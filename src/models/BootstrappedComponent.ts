import type { DefineComponent } from 'vue'

/**
 * Represents a bootstrapped component with provided props.
 */
export interface BootstrappedComponent {
  /**
   * The Vue component definition.
   */
  component: DefineComponent<any, any, any>

  /**
   * Optional properties to be passed to the component.
   */
  props?: any
}
