import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import ReportLayoutRenderer from '../ReportLayoutRenderer.vue'

const reportLayout = ref({
  id: 'report1',
  title: 'Sample Report',
  leftPane: { id: 'left1', sections: [], paneWidthPercent: 33 },
  centerPane: { id: 'center1', sections: [], paneWidthPercent: 34 },
  rightPane: { id: 'right1', sections: [], paneWidthPercent: 33 }
})

describe('ReportLayoutRenderer.vue', () => {
  it('renders the report title', () => {
    const wrapper = mount(ReportLayoutRenderer, {
      props: { reportLayout: reportLayout.value }
    })
    expect(wrapper.find('h3').text()).toBe('Sample Report')
  })

  it('renders all panes when they have width', () => {
    const wrapper = mount(ReportLayoutRenderer, {
      props: { reportLayout: reportLayout.value }
    })
    expect(wrapper.findAll('.pane-layout').length).toBe(3)
  })

  it('renders only center pane when left and right panes have 0 width', () => {
    const modifiedLayout = {
      ...reportLayout.value,
      leftPane: { ...reportLayout.value.leftPane, paneWidthPercent: 0 },
      rightPane: { ...reportLayout.value.rightPane, paneWidthPercent: 0 }
    }
    const wrapper = mount(ReportLayoutRenderer, {
      props: { reportLayout: modifiedLayout }
    })
    expect(wrapper.findAll('.pane-layout').length).toBe(1)
  })
})
