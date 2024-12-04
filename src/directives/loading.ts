import { createApp, type Directive, type DirectiveBinding, h } from 'vue'
import CustomLoading from '../components/CustomLoading.vue'

// Define the types for the directive binding and element
interface HTMLElementWithLoading extends HTMLElement {
  loadingElement?: HTMLElement | null;
}

const loadingDirective: Directive<HTMLElementWithLoading, boolean> = {
  mounted(el: HTMLElementWithLoading, binding: DirectiveBinding<boolean>) {
    if (binding.value) {
      // Create a Vue instance with the CustomLoading component
      const loadingApp = createApp({
        render() {
          return h(CustomLoading, { isVisible: true })
        },
      })

      // Mount the loading and append it to the element
      const loadingInstance = loadingApp.mount(document.createElement('div'))
      el.loadingElement = loadingInstance.$el as HTMLElement // Save reference for later removal
      el.appendChild(el.loadingElement)
    }
  },
  updated(el: HTMLElementWithLoading, binding: DirectiveBinding<boolean>) {
    if (binding.value && !el.loadingElement) {
      // Add the loading if it's not already present
      const loadingApp = createApp({
        render() {
          return h(CustomLoading, { isVisible: true })
        },
      })
      const loadingInstance = loadingApp.mount(document.createElement('div'))
      el.loadingElement = loadingInstance.$el as HTMLElement
      el.appendChild(el.loadingElement)
    } else if (!binding.value && el.loadingElement) {
      // Remove the loading if it exists
      el.removeChild(el.loadingElement)
      el.loadingElement = null
    }
  },
  unmounted(el: HTMLElementWithLoading) {
    // Clean up on unmount
    if (el.loadingElement) {
      el.removeChild(el.loadingElement)
      el.loadingElement = null
    }
  },
}

export default loadingDirective
