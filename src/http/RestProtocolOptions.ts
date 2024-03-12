export interface RestProtocolOptions {
  baseUrl: string
  headers?: Record<string, string | null>
  cacheHandler?: any // TODO: define interface
  retryHandler?: any // TODO: define interface
  errorHandler?: any // TODO: define interface
  requestStateChange?: any // TODO: define interface
}

// TODO: change retries to be a retryHandler that can be injected
// TODO: need to implement requestProgress.  This is a function that can be called to update the UI with the progress
// of the request something like { start: () => void, complete: () => void  } // maybe add error or progressUpdate?
