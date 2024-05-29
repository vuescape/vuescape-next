import { type ComponentPublicInstance } from 'vue'

/**
 * ErrorHandler type definition.
 */
export type ErrorHandler = (
  /** The error object. */
  err: unknown,
  /** The Vue component instance where the error occurred. Can be null. */
  instance: ComponentPublicInstance | null,
  /** Vue-specific error info, e.g., which lifecycle hook the error was thrown in. */
  info: string
) => void
