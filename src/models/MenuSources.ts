/**
 * Enum representing the sources of a Menu.
 */
// tslint:disable:no-bitwise
export enum MenuSources {
  /** No source. */
  None = 0,

  /** Source from configuration. */
  Configuration = 1 << 0,

  /** Source based on role. */
  RoleBased = 1 << 1,

  /** Source from feature. */
  Feature = 1 << 2,

  /** All sources. */
  All = Configuration | RoleBased | Feature,
}

// tslint:enable:no-bitwise
