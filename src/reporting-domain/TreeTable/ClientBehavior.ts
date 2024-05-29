/**
 * Class representing a client behavior.
 */
export class ClientBehavior {
  public static readonly AdjustTreeTableColumnSizeClientBehavior = 'AdjustTreeTableColumnSizeClientBehavior'
  public static readonly ConstrainTreeTableHeightBehavior = 'ConstrainTreeTableHeightBehavior'
  public static readonly GeneratePdfBehavior = 'GeneratePdfBehavior'
  public static readonly SortTreeTableClientBehavior = 'SortTreeTableClientBehavior'
  public static readonly ToggleTreeTableChildRowExpansionClientBehavior = 'ToggleTreeTableChildRowExpansionClientBehavior'

  /** The name of the client behavior. */
  public name: string

  /**
   * Create a new client behavior.
   * @param name - The name of the client behavior.
   */
  constructor(name: string) {
    this.name = name
  }
}
