import { watch, reactive, toRefs, isRef, type Ref, type Reactive } from 'vue'

/**
 * Dynamically watches properties in a reactive source object or ref and triggers handlers on change.
 * @param source The reactive object or ref to watch.
 * @param handlers Handlers for specific properties.
 * @param options Additional watch options (e.g., `immediate`, `deep`).
 */
export function usePropertyWatch<T extends Record<string, any>>(
  source: Reactive<T> | Ref<T>,
  handlers: Partial<Record<keyof T, (newValue: T[keyof T], oldValue?: T[keyof T]) => void>>,
  options: { immediate?: boolean; deep?: boolean } = {}
): void {
  // Ensure the source is reactive or a ref
  const reactiveSource: Reactive<T> = isRef(source) ? reactive(source.value) : source

  // Convert the reactive source to refs for property-level reactivity
  const refs = toRefs(reactiveSource)

  // Set up a watcher for each handler
  Object.keys(handlers).forEach((key) => {
    const typedKey = key as keyof T

    if (typedKey in refs) {
      const refToWatch = refs[typedKey as keyof typeof refs]
      watch(
        refToWatch,
        (newValue, oldValue) => {
          const handler = handlers[typedKey]
          if (handler) {
            // Explicitly cast newValue and oldValue to T[keyof T]
            handler(newValue as T[keyof T], oldValue as T[keyof T])
          }
        },
        { immediate: options.immediate, deep: options.deep }
      )
    } else {
      console.warn(`[usePropertyWatch] Invalid key detected: ${key}`)
    }
  })
}
