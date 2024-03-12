import type { Link } from '../index'
import type { Section } from './Section'

export interface Report {
  id?: string
  title?: string
  sections: Array<Section>
  additionalReportInfo?: string
  downloadLinks?: Array<Link>
}
