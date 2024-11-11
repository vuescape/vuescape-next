import type { PaneLayout } from "./PaneLayout"

export interface ReportLayout {
    id: string
    title?: string
    leftPane?: PaneLayout
    rightPane?: PaneLayout
    centerPane?: PaneLayout
}
