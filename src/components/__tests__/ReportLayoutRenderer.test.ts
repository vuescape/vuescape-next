// import { ref } from 'vue'
import { describe, it } from 'vitest'

describe('ReportLayoutRenderer.vue', () => {
  it.todo('renders the report title', () => {
    // const wrapper = mount(ReportLayoutRenderer, {
    //   props: { reportLayouts: [reportLayouts.value[1]] }
    // })
    // console.info(wrapper.html())
    // expect(wrapper.find('h3').text()).toBe('Sample Report')
  })

  it.todo('renders all panes when they have width', () => {
    //   const wrapper = mount(ReportLayoutRenderer, {
    //     props: { reportLayouts: reportLayouts.value }
    //   })
    //   expect(wrapper.findAll('.pane-layout').length).toBe(3)
  })

  it.todo('renders only center pane when left and right panes have 0 width', () => {
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
  })
})
