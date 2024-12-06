/**
 * Represents an error that occurs during an API fetch operation.
 * Extends the built-in `Error` class to include the response object.
 */
export class ApiFetchError extends Error {
  response: Response

  /**
   * Constructs an instance of ApiFetchError.
   *
   * @param fetchResponse - The response object from a fetch request.
   */
  constructor(fetchResponse: Response) {
    super(`HTTP error! Status: ${fetchResponse?.status || 'unknown status'}`)
    this.name = new.target.name
    this.response = fetchResponse
  }
}
