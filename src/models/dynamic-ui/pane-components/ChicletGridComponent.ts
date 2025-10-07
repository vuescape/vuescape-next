import type { ChicletGridComponentPayload } from './ChicletGridComponentPayload'

/**
 * Represents a Chiclet Grid component in the dynamic UI.
 */
export interface ChicletGridComponent {
  /** The type of the component, which is always 'chicletGrid'. */
  typeName: 'component.chicletGrid'
  /** The payload containing the data for the Chiclet Grid component. */
  payload: ChicletGridComponentPayload
}
