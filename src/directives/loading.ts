import { createVNode, type Directive, type DirectiveBinding, render } from 'vue'
import CustomLoading from '../components/CustomLoading.vue'

interface HTMLElementWithLoading extends HTMLElement {
  loadingElement?: HTMLElement | null
}

/**
 * A custom Vue directive to show or hide a loading spinner on an element.
 */
const loadingDirective: Directive<HTMLElementWithLoading, boolean> = {
  mounted(el: HTMLElementWithLoading, binding: DirectiveBinding<boolean>) {
    if (binding.value) {
      // Create a vnode instead of a Vue app
      const vnode = createVNode(CustomLoading, { isVisible: true })
      const container = document.createElement('div')

      render(vnode, container) // Render the vnode
      el.loadingElement = container.firstElementChild as HTMLElement
      el.appendChild(el.loadingElement)
    }
  },
  updated(el: HTMLElementWithLoading, binding: DirectiveBinding<boolean>) {
    if (binding.value && !el.loadingElement) {
      const vnode = createVNode(CustomLoading, { isVisible: true })
      const container = document.createElement('div')

      render(vnode, container) // Render the vnode
      el.loadingElement = container.firstElementChild as HTMLElement
      el.appendChild(el.loadingElement)
    } else if (!binding.value && el.loadingElement) {
      el.removeChild(el.loadingElement)
      el.loadingElement = null
    }
  },
  unmounted(el: HTMLElementWithLoading) {
    if (el.loadingElement) {
      el.removeChild(el.loadingElement)
      el.loadingElement = null
    }
  }
}

export default loadingDirective
