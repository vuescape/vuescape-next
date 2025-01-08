import { useRouter, useRoute } from 'vue-router'

/**
 * Provides declarative deep linking navigation.
 * @param initialState Optional initial state to override or initialize route-based properties.
 */
/**
 * A composable function that provides utilities to manage and update route parameters and query strings.
 *
 * @template T - A generic type extending a record with string keys and any values.
 *
 * @param {Partial<T>} [initialState] - An optional initial state to set route parameters and query strings.
 *
 * @returns {Object} An object containing the `updateRouteProps` function.
 *
 * @function
 * @name useRouteProps
 *
 * @example
 * ```typescript
 * const { updateRouteProps } = useRouteProps<{ id: string }>({ id: '123' });
 * updateRouteProps({ id: '456' });
 * ```
 *
 * @function
 * @name updateRouteProps
 *
 * @param {Partial<T>} updates - An object containing the updates to be applied to the route parameters and query strings.
 *
 * @description
 * The `updateRouteProps` function updates the route parameters and query strings with the provided updates.
 * It only pushes the new state to the router if there are actual changes.
 *
 */
export function useRouteProps<T extends Record<string, any>>(initialState?: Partial<T>) {
  const router = useRouter()
  const route = useRoute()

  // Function to update route params and query
  const updateRouteProps = (updates: Partial<T>) => {
    const newParams = { ...route.params }
    const newQuery = { ...route.query }

    Object.entries(updates).forEach(([key, value]) => {
      if (key in route.params) {
        newParams[key] = value
      } else {
        newQuery[key] = value
      }
    })

    // Only push if there are actual changes
    if (!isEqual(route.params, newParams) || !isEqual(route.query, newQuery)) {
      router.push({ params: newParams, query: newQuery })
    }
  }

  // Utility to extract matching keys from a source object
  // const extractKeys = (source: Partial<T>, reference: Record<string, any>) => {
  //   const result: Record<string, any> = {}
  //   for (const key in source) {
  //     if (key in reference) {
  //       result[key] = source[key]
  //     }
  //   }
  //   return result
  // }

  // Utility to compare two objects shallowly
  const isEqual = (obj1: Record<string, any>, obj2: Record<string, any>) => {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) return false
    return keys1.every((key) => obj1[key] === obj2[key])
  }

  // Initialize state if provided
  if (initialState) {
    updateRouteProps(initialState)
  }

  return {
    updateRouteProps
  }
}
