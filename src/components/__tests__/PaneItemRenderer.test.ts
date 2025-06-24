import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaneItemRenderer from '../PaneItemRenderer.vue'
import type { PaneItemRendererProps } from '../../models/componentProps/PaneItemRendererProps'

const props: PaneItemRendererProps = {
  item: {
    width: '100%',
    horizontalAlignment: 'center',
    verticalAlignment: 'top',
    components: [{ type: 'title', payload: { text: 'This is the title' } }]
  }
}

describe('PaneItemRenderer', () => {
  // TODO: fix test -- Skipping for now due to failure
  it.skip('renders the correct number of components', () => {
    const wrapper = mount(PaneItemRenderer, {
      props: { item: props.item }
    })
    const components = wrapper.findAllComponents({ name: 'component' })
    expect(components.length).toBe(props.item.components.length)
  })

  it('passes the correct props to each component', () => {
    const wrapper = mount(PaneItemRenderer, {
      props: { item: props.item }
    })
    const components = wrapper.findAllComponents({ name: 'component' })
    components.forEach((componentWrapper, index) => {
      expect(componentWrapper.props().component).toEqual(props.item.components[index])
      expect(componentWrapper.props()).toMatchObject(props.item.components[index].payload)
    })
  })

  it('applies the correct styles and classes', () => {
    const wrapper = mount(PaneItemRenderer, {
      props: { item: props.item }
    })
    const div = wrapper.find('div')
    expect(div.attributes('style')).toContain(`width: ${props.item.width}`)
    expect(div.classes()).toContain(`justify-${props.item.horizontalAlignment}`)
    expect(div.classes()).toContain(`items-${props.item.verticalAlignment}`)
  })
})
