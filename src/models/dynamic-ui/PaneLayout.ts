import type { PaneSection } from './PaneSection'

export interface PaneLayout {
  id: string
  sections: Array<PaneSection>
  paneWidthPercent: number
}
