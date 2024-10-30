import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChicletGrid from '../ChicletGrid.vue'

import type { ChicletGridProps } from '../../models/componentProps/ChicletGridProps'

const chicletGridProps: ChicletGridProps = {
  chiclets: [
    {
      isVisible: true,
      icons: ['pi pi-check1'],
      cssClass: 'custom-class1',
      action: {
        type: 'navigate',
        payload: {
          url: 'http://example1.com',
          target: '_blank'
        }
      },
      id: 'id-value-1',
      title: 'Example1 Site'
    },
    {
      isVisible: true,
      icons: ['pi pi-check2'],
      cssClass: 'custom-class2',
      action: {
        type: 'navigate',
        payload: {
          url: 'http://example2.com',
          target: '_blank'
        }
      },
      id: 'id-value-2',
      title: 'Example2 Site'
    },
    {
      isVisible: true,
      icons: ['pi pi-check3'],
      cssClass: 'custom-class3',
      action: {
        type: 'navigate',
        payload: {
          url: 'http://example3.com',
          target: '_blank'
        }
      },
      id: 'id-value-3',
      title: 'Example3 Site'
    }
  ]
}

describe('ChicletGrid.vue', () => {
  it('renders the correct number of chiclets', () => {
    const wrapper = mount(ChicletGrid, {
      props: { chiclets: chicletGridProps.chiclets }
    })
    const chicletButtons = wrapper.findAllComponents({ name: 'ChicletButton' })
    expect(chicletButtons.length).toBe(3)
  })

  it('renders chiclet titles correctly', () => {
    const wrapper = mount(ChicletGrid, {
      props: { chiclets: chicletGridProps.chiclets }
    })
    const chicletLabels = wrapper.findAll('.chiclet-grid__button-label')
    expect(chicletLabels[0].text()).toBe('Example1 Site')
    expect(chicletLabels[1].text()).toBe('Example2 Site')
    expect(chicletLabels[2].text()).toBe('Example3 Site')
  })
})
