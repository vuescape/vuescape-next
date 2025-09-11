import type { Ref } from 'vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRetainQueryStore } from '../stores/useRetainQueryStore'

export function useRetainedField<T>(
  queryKey: string,
  defaultValue: T,
  encode?: (v: T) => string,
  decode?: (v: string) => T,
  // optional override to disable URL syncing even if route.meta is true
  forceUrlSync?: boolean
): { value: Ref<T> } {
  const route = useRoute()
  const router = useRouter()
  const retained = useRetainQueryStore()
  const value = ref<T>(defaultValue)

  const routeWantsRetention = !!route.meta?.retainQuery
  const syncUrl = forceUrlSync ?? routeWantsRetention

  onMounted(() => {
    if (!routeWantsRetention) return // behave like a normal uncontrolled field

    const fromQueryRaw = route.query[queryKey]
    const fromStoreRaw = retained.restore(route)?.[queryKey]

    const first =
      typeof fromQueryRaw === 'string'
        ? fromQueryRaw
        : typeof fromStoreRaw === 'string'
          ? fromStoreRaw
          : undefined

    value.value = first != null ? (decode ? decode(first) : (first as unknown as T)) : defaultValue

    const encoded = encode ? encode(value.value) : String(value.value)
    retained.save({ ...route, query: { ...route.query, [queryKey]: encoded } } as any)
    if (syncUrl && fromQueryRaw !== encoded) {
      router.replace({ query: { ...route.query, [queryKey]: encoded } })
    }
  })

  watch(
    value,
    (v, prev) => {
      if (!routeWantsRetention) return
      if (Object.is(v, prev)) return

      const encoded = encode ? encode(v) : String(v)
      retained.save({ ...route, query: { ...route.query, [queryKey]: encoded } } as any)
      if (syncUrl && route.query[queryKey] !== encoded) {
        router.replace({ query: { ...route.query, [queryKey]: encoded } })
      }
    },
    { flush: 'post' }
  )

  // Explicitly cast to Ref<T> to satisfy return value.
  const result = { value: value as Ref<T> }
  return result
}
