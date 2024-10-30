import { ReportLayout } from '../../models'

export const reportLayout: ReportLayout = {
  id: 'report-123',
  title: 'Monthly Performance Report',
  leftPane: {
    id: 'left-pane',
    paneWidthPercent: 20,
    sections: [
      {
        id: 'section-1',
        items: [
          {
            width: '100%',
            horizontalAlignment: 'center',
            verticalAlignment: 'top',
            components: [
              {
                type: 'title',
                payload: {
                  text: 'Key Metrics'
                }
              },
              {
                type: 'button',
                payload: {
                  text: 'View Details',
                  action: {
                    type: 'navigate',
                    payload: {
                      url: '/details',
                      target: '_self',
                      replace: false
                    }
                  },
                  icons: ['fas fa-info-circle']
                }
              }
            ]
          }
        ]
      }
    ]
  },
  rightPane: {
    id: 'right-pane',
    paneWidthPercent: 20,
    sections: [
      {
        id: 'section-2',
        items: [
          {
            width: '100%',
            horizontalAlignment: 'right',
            verticalAlignment: 'center',
            components: [
              {
                type: 'chicletGrid',
                payload: {
                  chiclets: [
                    {
                      id: 'chiclet-1',
                      title: 'Tasks Completed',
                      isVisible: true,
                      icons: ['fas fa-check'],
                      action: {
                        type: 'navigate',
                        payload: {
                          url: '/tasks',
                          target: '_self'
                        }
                      }
                    },
                    {
                      id: 'chiclet-2',
                      title: 'Pending Approvals',
                      isVisible: true,
                      icons: ['fas fa-hourglass-half'],
                      action: {
                        type: 'navigate',
                        payload: {
                          url: '/approvals',
                          target: '_self'
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },
  centerPane: {
    id: 'center-pane',
    paneWidthPercent: 60,
    sections: [
      {
        id: 'section-3',
        items: [
          {
            width: '100%',
            horizontalAlignment: 'center',
            verticalAlignment: 'center',
            components: [
              {
                type: 'table',
                payload: {
                  headers: ['Metric', 'Value', 'Target'],
                  rows: [
                    ['Revenue', '$10,000', '$12,000'],
                    ['Conversion Rate', '3.5%', '5.0%'],
                    ['Customer Satisfaction', '85%', '90%']
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
