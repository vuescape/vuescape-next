export class ApiFetchError extends Error {
  response: Response // Declare the fetchResponse property

  constructor(fetchResponse: Response) {
    super(`HTTP error! Status: ${fetchResponse?.status || 'unknown status'}`)
    this.name = new.target.name
    this.response = fetchResponse
  }
}
