import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import PaneLayoutRenderer from '../PaneLayoutRenderer.vue'
import PaneSectionRenderer from '../PaneSectionRenderer.vue'

import type { PaneLayoutRendererProps } from '../../models/componentProps/PaneLayoutRendererProps'

setActivePinia(createPinia())

// Mock router setup
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div>Not Found</div>' } }
  ]
})

describe('PaneSectionsRenderer', () => {
  it('renders the correct number of sections', () => {
    const wrapper = mount(PaneLayoutRenderer, {
      global: {
        plugins: [router]
      },
      props: { pane: props.pane }
    })
    expect(wrapper.findAllComponents(PaneSectionRenderer).length).toBe(props.pane.sections.length)
  })

  it('passes the correct props to PaneSectionRenderer', () => {
    const wrapper = mount(PaneLayoutRenderer, {
      global: {
        plugins: [router]
      },
      props: { pane: props.pane }
    })
    const sectionRenderers = wrapper.findAllComponents(PaneSectionRenderer)
    sectionRenderers.forEach((renderer, index) => {
      expect(renderer.props('section')).toEqual(props.pane.sections[index])
    })
  })
})

const props: PaneLayoutRendererProps = {
  pane: {
    id: 'center-pane',
    sections: [
      {
        id: 'section-2',
        items: [
          {
            width: '100%',
            horizontalAlignment: 'center',
            verticalAlignment: 'top',
            components: [
              {
                typeName: 'component.chicletGrid',
                payload: {
                  chiclets: [
                    {
                      id: '1',
                      title: 'Benchmarking for a Company',
                      isVisible: true,
                      icons: ['fas', 'fa-bullseye'],
                      action: { typeName: 'action.navigate', payload: { url: '/benchmarking/company' } }
                    },
                    {
                      id: '2',
                      title: 'Benchmarking',
                      isVisible: true,
                      icons: ['fa-solid', 'fa-bullseye'],
                      action: { typeName: 'action.navigate', payload: { url: '/benchmarking' } }
                    },
                    {
                      id: '3',
                      title: 'This is a really really really long Chart label',
                      isVisible: true,
                      icons: ['fas', 'fa-chart-scatter'],
                      action: { typeName: 'action.navigate', payload: { url: '/coscore/long-company' } }
                    },
                    {
                      id: '4',
                      title: 'Chart',
                      isVisible: true,
                      icons: ['fas', 'fa-chart-scatter'],
                      action: { typeName: 'action.navigate', payload: { url: '/coscore' } }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
