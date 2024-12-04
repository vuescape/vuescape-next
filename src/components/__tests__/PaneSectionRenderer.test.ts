import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import PaneSectionRenderer from '../../components/PaneSectionRenderer.vue'
import type { PaneSectionRendererProps } from '../../models/componentProps/PaneSectionRendererProps'
import PaneItemView from '../PaneItemRenderer.vue'
import { createPinia, setActivePinia } from 'pinia'

setActivePinia(createPinia())

describe('PaneSectionRenderer', () => {
  it('renders the correct number of items', () => {
    const wrapper = mount(PaneSectionRenderer, {
      props: { section: props.section }
    })

    const items = wrapper.findAllComponents(PaneItemView)
    expect(items.length).toBe(props.section.items.length)
  })

  it('passes the correct props to PaneItemView', () => {
    const wrapper = mount(PaneSectionRenderer, {
      props: { section: props.section }
    })
    const items = wrapper.findAllComponents(PaneItemView)
    items.forEach((itemWrapper, index) => {
      expect(itemWrapper.props().item).toEqual(props.section.items[index])
    })
  })
})

const props: PaneSectionRendererProps = {
  section: {
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
}
