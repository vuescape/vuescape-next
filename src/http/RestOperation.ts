import type { RestOperationOptions } from './RestOperationOptions'

export class RestOperation {
  private readonly _restOperationOptions: RestOperationOptions

  constructor(
    restOperationOptions: RestOperationOptions,
  ) {
    this._restOperationOptions = restOperationOptions
  }

  public get restOperationOptions(): RestOperationOptions {
    return this._restOperationOptions
  }
}
