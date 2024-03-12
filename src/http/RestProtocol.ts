import { RestOperation } from '@vuescape/http/RestOperation'
import { HttpMethod } from '@vuescape/http/HttpMethod'

import type { RestProtocolOptions } from './RestProtocolOptions'
export class RestProtocol {
  private readonly restProtocolOptions: RestProtocolOptions

  constructor(
    restProtocolOptions: RestProtocolOptions,
  ) {
    this.restProtocolOptions = restProtocolOptions
  }

  public async executeAsync(operation: RestOperation): Promise<any> {
    throw new Error('Not implemented')
  }

  // CONFIGURE in the AppBoostrapper and then inject where required
  // TODO: add support for spinner/notifications
  // TODO: add support for API keep alive
  // TODO: handle support for error handling (e.g. display error message)
  // TODO: handle authentication and authorization failures (e.g. redirect to login page)
  // TODO: add support for retries
  // TODO: add support for caching
  // TODO: add support for auth/header injection
}

const x = new RestProtocol({
  baseUrl: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})
await x.executeAsync(new RestOperation({httpMethod : HttpMethod.Get}))
