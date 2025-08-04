import type { ButtonComponent } from './ButtonComponent'
import type { ChicletGridComponent } from './ChicletGridComponent'
import type { FileUploadComponent } from './FileUploadComponent'
import type { ReadOnlyFileUploadComponent } from './ReadOnlyFileUploadComponent'
import type { SelectComponent } from './SelectComponent'
import type { TableComponent } from './TableComponent'
import type { TableTabsComponent } from './TableTabsComponent'
import type { TextComponent } from './TextComponent'
import type { TextLinkComponent } from './TextLinkComponent'

/**
 * Represents a component that can be used within a pane in the dynamic UI.
 * This type is a union of all possible component types.
 */
export type PaneComponent =
  | TextComponent
  | ButtonComponent
  | ChicletGridComponent
  | FileUploadComponent
  | TableComponent
  | SelectComponent
  | TableTabsComponent
  | TextLinkComponent
  | ReadOnlyFileUploadComponent
