import type { ChicletGridProps } from '../componentProps/ChicletGridProps'
import type { TableProps } from '../componentProps/TableProps'

export type Pane =
  | {
      component: 'Table'
      id: string
      position: string
      props: TableProps
    }
  | {
      component: 'ChicletGrid'
      id: string
      position: string
      props: ChicletGridProps
    }
