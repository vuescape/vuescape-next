import { HttpMethod } from '@vuescape/http/HttpMethod'
import { RestPayloadStrategy } from '@vuescape/http/RestPayloadStrategy'

export interface RestOperationOptions {
  httpMethod: HttpMethod
  abortController?: AbortController
  headers?: Record<string, string | null>
  payload?: any
  restPayloadStrategy?: RestPayloadStrategy
}
