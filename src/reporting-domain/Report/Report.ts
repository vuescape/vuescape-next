import type { Link } from '../index'
import type { Section } from './Section'

/**
 * Interface representing a Report.
 */
export interface Report {
  /** The ID of the report. Optional. */
  id?: string

  /** The title of the report. Optional. */
  title?: string

  /** The sections of the report. */
  sections: Array<Section>

  /** Additional information about the report. Optional. */
  additionalReportInfo?: string

  /** The download links for the report. Optional. */
  downloadLinks?: Array<Link>
}
