import type { ButtonComponent } from './ButtonComponent'
import type { ChicletGridComponent } from './ChicletGridComponent'
import type { SelectComponent } from './SelectComponent'
import type { TableComponent } from './TableComponent'
import type { TableTabsComponent } from './TableTabsComponent'
import type { TextLinkComponent } from './TextLinkComponent'
import type { TitleComponent } from './TitleComponent'

/**
 * Represents a component that can be used within a pane in the dynamic UI.
 * This type is a union of all possible component types:
 * - `TitleComponent`: A component that displays a title.
 * - `ButtonComponent`: A component that represents a button.
 * - `ChicletGridComponent`: A component that displays a grid of chiclets.
 * - `TableComponent`: A component that displays a table.
 */
export type PaneComponent =
  | TitleComponent
  | ButtonComponent
  | ChicletGridComponent
  | TableComponent
  | SelectComponent
  | TableTabsComponent
  | TextLinkComponent
