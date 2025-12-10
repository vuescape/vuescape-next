import type { ReportLayout } from '../dynamic-ui'

/**
 * Properties for the ReportLayoutRenderer component.
 */
export interface ReportLayoutRendererProps {
  reportLayouts: Array<ReportLayout>

  /**
   * Whether to use deep watching for prop changes.
   * Set to false for large datasets to improve performance.
   * @default true
   */
  deepWatch?: boolean
}
