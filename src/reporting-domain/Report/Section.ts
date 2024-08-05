import type { TreeTable } from '@/reporting-domain/TreeTable'

/**
 * Interface representing a Section.
 */
export interface Section {
  /** The ID of the section. Optional. */
  id?: string

  /** The title of the section. Optional. */
  title?: string

  /** The name of the section. Optional. */
  name?: string

  /** The tree table of the section. */
  treeTable: TreeTable
}
