/**
 * Enum representing the kind of resource.
 */
export enum ResourceKind {
  /** Unknown (default). */
  Unknown,

  /** A Report. */
  Report,

  /** JSON document. */
  Json,

  /** An image. */
  Image,

  /** Audio. */
  Audio,

  /** Video. */
  Video,

  /** HTML. */
  Html,

  /** A Microsoft Excel file. */
  Excel,

  /** A CSV file. */
  Csv,

  /** A PDF file. */
  Pdf,

  /** A Zip file. */
  Zip,

  /** Text. */
  Text,

  /** BSON as text. */
  BsonAsText,

  /** BSON as bytes. */
  BsonAsBytes,
}
