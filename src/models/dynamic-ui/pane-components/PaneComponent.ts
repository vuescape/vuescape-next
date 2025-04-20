import type { ButtonComponent } from './ButtonComponent'
import type { ChicletGridComponent } from './ChicletGridComponent'
import type { FileUploadComponent } from './FileUploadComponent'
import type { SelectComponent } from './SelectComponent'
import type { TableComponent } from './TableComponent'
import type { TableTabsComponent } from './TableTabsComponent'
import type { TextLinkComponent } from './TextLinkComponent'
import type { TitleComponent } from './TitleComponent'

/**
 * Represents a component that can be used within a pane in the dynamic UI.
 * This type is a union of all possible component types.
 */
export type PaneComponent =
  | TitleComponent
  | ButtonComponent
  | ChicletGridComponent
  | FileUploadComponent
  | TableComponent
  | SelectComponent
  | TableTabsComponent
  | TextLinkComponent
