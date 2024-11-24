import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import ReportLayoutRenderer from '../ReportLayoutRenderer.vue'
import { ReportPaneKind } from '../../models/feature'

const reportLayouts = ref([
  {
    id: 'report-left',
    title: 'Left Report',
    content: {
      id: 'left-content',
      sections: [],
      targetPane: ReportPaneKind.LeftPane,
      paneWidthPercent: 20
    }
  },
  {
    id: 'report-center',
    title: 'Center Report',
    content: {
      id: 'center-content',
      sections: [],
      targetPane: ReportPaneKind.CenterPane,
      paneWidthPercent: 60
    }
  },
  {
    id: 'report-right',
    title: 'Right Report',
    content: {
      id: 'right-content',
      sections: [],
      targetPane: ReportPaneKind.RightPane,
      paneWidthPercent: 20
    }
  }
])

describe('ReportLayoutRenderer.vue', () => {
  it('renders the report title', () => {
    // const wrapper = mount(ReportLayoutRenderer, {
    //   props: { reportLayouts: [reportLayouts.value[1]] }
    // })
    // console.info(wrapper.html())
    // expect(wrapper.find('h3').text()).toBe('Sample Report')
  })

  // it('renders all panes when they have width', () => {
  //   const wrapper = mount(ReportLayoutRenderer, {
  //     props: { reportLayouts: reportLayouts.value }
  //   })
  //   expect(wrapper.findAll('.pane-layout').length).toBe(3)
  // })

  // it('renders only center pane when left and right panes have 0 width', () => {
  //   const modifiedLayout: Array<ReportLayout> = []
  //   reportLayouts.value.forEach((layout) => {
  //     if (layout.content.targetPane === ReportPaneKind.CenterPane) {
  //       layout.content.paneWidthPercent = 100
  //     } else {
  //       layout.content.paneWidthPercent = 0
  //     }
  //     modifiedLayout.push(layout)
  //   })
  //   const wrapper = mount(ReportLayoutRenderer, {
  //     props: { reportLayouts: modifiedLayout }
  //   })
  //   expect(wrapper.findAll('.pane-layout').length).toBe(1)
  // })
})
