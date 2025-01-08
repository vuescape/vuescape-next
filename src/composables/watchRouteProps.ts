import { watch } from 'vue'
import type { LocationQueryValue } from 'vue-router'
import { useRoute } from 'vue-router'

/**
 * Normalizes `params` and `query` values to always return a string or undefined.
 */
function normalizeValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    const normalized =
      value.filter((v): v is string => v !== null && v !== undefined)[0] || undefined
    return normalized
  }

  return value ?? undefined
}

/**
 * Validates handler keys against the provided source object.
 */
function validateHandlers<T>(handlers: Partial<Record<keyof T, any>>, source: Record<string, any>) {
  Object.keys(handlers).forEach((key) => {
    if (!(key in source)) {
      console.warn(`[watchRoute] Invalid key detected: ${key}`)
    }
  })
}

// TODO: resolve reactivity issues.  Preferred version to setup watchers but this seems to break reactivity.
// /**
//  * Sets up watchers for a given source object.
//  */
// function setupWatch<T>(
//   source: Record<string, any>,
//   handlers: Partial<
//     Record<keyof T, (newValue: string | undefined, oldValue: string | undefined) => void>
//   >,
//   options?: { immediate?: boolean }
// ) {
//   Object.keys(source).forEach((key) => {
//     if (key in handlers) {
//       watch(
//         () => {
//           const value = source[key]
//           return normalizeValue(value)
//         },
//         (newValue, oldValue) => {
//           handlers[key as keyof T]?.(newValue, oldValue)
//         },
//         { immediate: options?.immediate }
//       )
//     }
//   })
// }

/**
 * Watches changes to `params` and `query` and triggers handlers.
 */
export function watchRouteProps<T extends Record<string, any>>(
  handlers: Partial<
    Record<keyof T, (newValue: string | undefined, oldValue: string | undefined) => void>
  >,
  options?: { immediate?: boolean }
) {
  const route = useRoute()

  validateHandlers(handlers, { ...route.params, ...route.query })

  // TODO: Use setupWatch when reactivity issues are resolved when wiring up watches in the helper method.
  // In the meantime we will duplicate the watching code for route.params and route.query.
  //
  // Watch params
  Object.keys(route.params).forEach((key) => {
    if (key in handlers) {
      watch(
        () => normalizeValue(route.params[key]),
        (newValue, oldValue) => {
          handlers[key as keyof T]?.(newValue, oldValue)
        },
        { immediate: options?.immediate }
      )
    }
  })

  // Watch query
  Object.keys(route.query).forEach((key) => {
    if (key in handlers) {
      watch(
        () => normalizeValue(route.query[key]),
        (newValue, oldValue) => {
          handlers[key as keyof T]?.(newValue, oldValue)
        },
        { immediate: options?.immediate }
      )
    }
  })

  // setupWatch(route.params, handlers, options)
  // setupWatch(route.query, handlers, options)
}
