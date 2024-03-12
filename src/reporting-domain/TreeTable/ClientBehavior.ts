export class ClientBehavior {
  public static readonly AdjustTreeTableColumnSizeClientBehavior        = 'AdjustTreeTableColumnSizeClientBehavior'
  public static readonly ConstrainTreeTableHeightBehavior               = 'ConstrainTreeTableHeightBehavior'
  public static readonly GeneratePdfBehavior                            = 'GeneratePdfBehavior'
  public static readonly SortTreeTableClientBehavior                    = 'SortTreeTableClientBehavior'
  public static readonly ToggleTreeTableChildRowExpansionClientBehavior = 'ToggleTreeTableChildRowExpansionClientBehavior'

  constructor(name: string) {
    this.name = name
  }

  public name: string
}
