import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'

import BreadcrumbComponent from '../BreadcrumbComponent.vue'
import type { BreadcrumbItem } from '../../models/BreadcrumbItem'

// Mock router setup
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/my-data', component: { template: '<div>My Data</div>' } },
    { path: '/my-data/product/123', component: { template: '<div>Product</div>' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div>Not Found</div>' } }
  ]
})

const primeVuePlugin: [any, any] = [
  PrimeVue,
  {
    ripple: false,
    locale: { aria: { next: 'Next', previous: 'Previous' } }
  }
]

describe('BreadcrumbComponent.vue', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const createWrapper = (props: { customBreadcrumbs?: BreadcrumbItem[] | null } = {}) => {
    return mount(BreadcrumbComponent, {
      props,
      global: {
        plugins: [primeVuePlugin, router, pinia]
      }
    })
  }

  const mockBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/', clickable: true },
    { label: 'My Data', path: '/my-data', clickable: true },
    { label: 'Product', path: '/my-data/product/123', clickable: false }
  ]

  describe('Rendering', () => {
    it('renders breadcrumbs when customBreadcrumbs prop is provided', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      expect(wrapper.find('.breadcrumb').exists()).toBe(true)
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(true)
      expect(wrapper.findAll('.breadcrumb__item')).toHaveLength(3)
    })

    it('renders empty breadcrumbs when customBreadcrumbs is empty array', () => {
      const wrapper = createWrapper({ customBreadcrumbs: [] })
      
      expect(wrapper.find('.breadcrumb').exists()).toBe(true)
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(false)
    })

    it('renders empty breadcrumbs when customBreadcrumbs is null', () => {
      const wrapper = createWrapper({ customBreadcrumbs: null })
      
      expect(wrapper.find('.breadcrumb').exists()).toBe(true)
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(false)
    })

    it('renders empty breadcrumbs when customBreadcrumbs prop is not provided', () => {
      const wrapper = createWrapper()
      
      expect(wrapper.find('.breadcrumb').exists()).toBe(true)
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(false)
    })

    it('does not render breadcrumb list when only one item is provided', () => {
      const singleBreadcrumb = [{ label: 'Home', path: '/', clickable: true }]
      const wrapper = createWrapper({ customBreadcrumbs: singleBreadcrumb })
      
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(false)
    })

    it('renders breadcrumb list when two or more items are provided', () => {
      const twoBreadcrumbs = [
        { label: 'Home', path: '/', clickable: true },
        { label: 'My Data', path: '/my-data', clickable: true }
      ]
      const wrapper = createWrapper({ customBreadcrumbs: twoBreadcrumbs })
      
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(true)
      expect(wrapper.findAll('.breadcrumb__item')).toHaveLength(2)
    })
  })

  describe('Breadcrumb Items', () => {
    it('renders correct labels for each breadcrumb item', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const items = wrapper.findAll('.breadcrumb__item')
      expect(items[0].text()).toContain('Home')
      expect(items[1].text()).toContain('My Data')
      expect(items[2].text()).toContain('Product')
    })

    it('renders clickable breadcrumbs as anchor tags', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const clickableItems = wrapper.findAll('a.breadcrumb__link')
      expect(clickableItems).toHaveLength(2) // First two items are clickable
      
      expect(clickableItems[0].attributes('href')).toBe('/')
      expect(clickableItems[1].attributes('href')).toBe('/my-data')
    })

    it('renders non-clickable breadcrumbs as span elements', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const nonClickableItems = wrapper.findAll('span.breadcrumb__text')
      expect(nonClickableItems).toHaveLength(1) // Last item is not clickable
      expect(nonClickableItems[0].text()).toBe('Product')
    })

    it('renders separators between breadcrumb items', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const separators = wrapper.findAll('.breadcrumb__separator')
      expect(separators).toHaveLength(2) // 3 items = 2 separators
      expect(separators[0].text()).toBe('/')
      expect(separators[1].text()).toBe('/')
    })

    it('does not render separator after the last item', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const lastItem = wrapper.findAll('.breadcrumb__item')[2]
      expect(lastItem.find('.breadcrumb__separator').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('has correct aria-label on nav element', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')
    })

    it('has correct aria-current attribute on last breadcrumb item', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const lastItem = wrapper.findAll('.breadcrumb__item')[2]
      const lastLink = lastItem.find('span.breadcrumb__text')
      expect(lastLink.attributes('aria-current')).toBe('page')
    })

    it('does not have aria-current on non-last items', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const firstItem = wrapper.findAll('.breadcrumb__item')[0]
      const firstLink = firstItem.find('a.breadcrumb__link')
      expect(firstLink.attributes('aria-current')).toBeUndefined()
    })

    it('has aria-hidden on separators', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const separators = wrapper.findAll('.breadcrumb__separator')
      separators.forEach(separator => {
        expect(separator.attributes('aria-hidden')).toBe('true')
      })
    })
  })

  describe('Navigation', () => {
    it('calls router.push when clickable breadcrumb is clicked', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const firstLink = wrapper.find('a.breadcrumb__link')
      await firstLink.trigger('click')
      
      expect(pushSpy).toHaveBeenCalledWith('/')
    })

    it('prevents default link behavior when clickable breadcrumb is clicked', async () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const firstLink = wrapper.find('a.breadcrumb__link')
      const preventDefaultSpy = vi.fn()
      
      await firstLink.trigger('click', {
        preventDefault: preventDefaultSpy
      })
      
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('does not call router.push when non-clickable breadcrumb is clicked', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const nonClickableItem = wrapper.find('span.breadcrumb__text')
      await nonClickableItem.trigger('click')
      
      expect(pushSpy).not.toHaveBeenCalled()
    })

    it('navigates to correct path when different clickable breadcrumb is clicked', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const secondLink = wrapper.findAll('a.breadcrumb__link')[1]
      await secondLink.trigger('click')
      
      expect(pushSpy).toHaveBeenCalledWith('/my-data')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty breadcrumb array gracefully', () => {
      const wrapper = createWrapper({ customBreadcrumbs: [] })
      
      expect(wrapper.find('.breadcrumb').exists()).toBe(true)
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(false)
    })

    it('handles undefined customBreadcrumbs prop', () => {
      const wrapper = createWrapper({ customBreadcrumbs: undefined })
      
      expect(wrapper.find('.breadcrumb').exists()).toBe(true)
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(false)
    })

    it('handles breadcrumbs with empty labels', () => {
      const breadcrumbsWithEmptyLabels = [
        { label: '', path: '/', clickable: true },
        { label: 'Valid Label', path: '/valid', clickable: true }
      ]
      const wrapper = createWrapper({ customBreadcrumbs: breadcrumbsWithEmptyLabels })
      
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(true)
      expect(wrapper.findAll('.breadcrumb__item')).toHaveLength(2)
    })

    it('handles breadcrumbs with empty paths', () => {
      const breadcrumbsWithEmptyPaths = [
        { label: 'Home', path: '', clickable: true },
        { label: 'My Data', path: '/my-data', clickable: true }
      ]
      const wrapper = createWrapper({ customBreadcrumbs: breadcrumbsWithEmptyPaths })
      
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(true)
      const firstLink = wrapper.find('a.breadcrumb__link')
      expect(firstLink.attributes('href')).toBe('')
    })
  })

  describe('CSS Classes', () => {
    it('applies correct CSS classes to breadcrumb elements', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      expect(wrapper.find('.breadcrumb').exists()).toBe(true)
      expect(wrapper.find('.breadcrumb__list').exists()).toBe(true)
      expect(wrapper.findAll('.breadcrumb__item')).toHaveLength(3)
      expect(wrapper.findAll('.breadcrumb__link')).toHaveLength(2)
      expect(wrapper.findAll('.breadcrumb__text')).toHaveLength(1)
      expect(wrapper.findAll('.breadcrumb__separator')).toHaveLength(2)
    })

    it('applies breadcrumb__link class to clickable items', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const clickableItems = wrapper.findAll('a.breadcrumb__link')
      clickableItems.forEach(item => {
        expect(item.classes()).toContain('breadcrumb__link')
      })
    })

    it('applies breadcrumb__text class to non-clickable items', () => {
      const wrapper = createWrapper({ customBreadcrumbs: mockBreadcrumbs })
      
      const nonClickableItems = wrapper.findAll('span.breadcrumb__text')
      nonClickableItems.forEach(item => {
        expect(item.classes()).toContain('breadcrumb__text')
      })
    })
  })
})
