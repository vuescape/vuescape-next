/**
 * Enum representing a UiObjectType.
 */
export enum UiObjectType {
  /** Represents no type. */
  None = 0,

  /** Represents a boolean type. */
  Bool,

  /** Represents a string type. */
  String,

  /** Represents an integer type. */
  Int,

  /** Represents a short type. */
  Short,

  /** Represents a long type. */
  Long,

  /** Represents a decimal type. */
  Decimal,

  /** Represents a DateTime type. */
  DateTime,

  /** Represents a Guid type. */
  Guid,

  /** Represents an Enum type. */
  Enum,

  /** Represents a specified type. */
  SpecifiedType,
}
