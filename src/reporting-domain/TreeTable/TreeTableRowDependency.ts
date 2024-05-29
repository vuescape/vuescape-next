/**
 * Interface representing a TreeTableRowDependency.
 */
export interface TreeTableRowDependency {
  /** The target id of the TreeTableRowDependency. */
  targetId: string

  /** The behavior of the TreeTableRowDependency.
   * TODO: This needs to be translated into an implementation from server TreeTableRowDependencyClientBehavior property.
   */
  treeTableRowDependencyBehavior: string

  /** The payload of the TreeTableRowDependency. Can be any value. */
  payload?: any
}
