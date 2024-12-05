import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import PaneLayoutRenderer from '../PaneLayoutRenderer.vue'
import PaneSectionRenderer from '../PaneSectionRenderer.vue'

import type { PaneLayoutRendererProps } from '../../models/componentProps/PaneLayoutRendererProps'

setActivePinia(createPinia())

describe('PaneSectionsRenderer', () => {
  it('renders the correct number of sections', () => {
    const wrapper = mount(PaneLayoutRenderer, {
      props: { pane: props.pane }
    })
    expect(wrapper.findAllComponents(PaneSectionRenderer).length).toBe(props.pane.sections.length)
  })

  it('passes the correct props to PaneSectionRenderer', () => {
    const wrapper = mount(PaneLayoutRenderer, {
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
                type: 'chicletGrid',
                payload: {
                  chiclets: [
                    {
                      id: '1',
                      title: 'Benchmarking for a Company',
                      isVisible: true,
                      icons: ['fas', 'fa-bullseye'],
                      action: { type: 'navigate', payload: { url: '/benchmarking/company' } }
                    },
                    {
                      id: '2',
                      title: 'Benchmarking',
                      isVisible: true,
                      icons: ['fa-solid', 'fa-bullseye'],
                      action: { type: 'navigate', payload: { url: '/benchmarking' } }
                    },
                    {
                      id: '3',
                      title: 'This is a really really really long Chart label',
                      isVisible: true,
                      icons: ['fas', 'fa-chart-scatter'],
                      action: { type: 'navigate', payload: { url: '/coscore/long-company' } }
                    },
                    {
                      id: '4',
                      title: 'Chart',
                      isVisible: true,
                      icons: ['fas', 'fa-chart-scatter'],
                      action: { type: 'navigate', payload: { url: '/coscore' } }
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
