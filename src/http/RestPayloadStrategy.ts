/**
 * This enum represents the different strategies for sending payloads in RESTful API calls.
 */
export enum RestPayloadStrategy {
  /**
   * No payload strategy.
   */
  None = 0,

  /**
   * Payload is sent as a query string.
   */
  QueryString = 1,

  /**
   * Payload is included in the URL.
   */
  Url = 2,

  /**
   * Payload is sent as JSON in the POST body.
   */
  PostJson = 4,

  /**
   * Payload is sent as form-encoded in the POST body.
   */
  PostFormEncoded = 8,

  /**
   * Payload is sent as multipart form-data in the POST body.
   */
  MultipartFormData = 16,
}
