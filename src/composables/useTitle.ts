import { watch, onUnmounted, type Ref, type ComputedRef } from 'vue'

/**
 * Simple, lightweight title management
 *
 * @param title - Static string, ref, or computed title
 * @param suffix - Optional suffix to append to title
 */
export function useTitle(title: string | Ref<string> | ComputedRef<string>, suffix: string) {
  const originalTitle = document.title

  const updateTitle = (newTitle: string) => {
    const finalTitle = newTitle + (newTitle.includes(suffix) ? '' : suffix)
    document.title = finalTitle
  }

  // Handle different title types
  if (typeof title === 'string') {
    updateTitle(title)
  } else {
    // Reactive title (ref or computed)
    const stopWatcher = watch(title, updateTitle, { immediate: true })

    onUnmounted(() => {
      stopWatcher()
      document.title = originalTitle
    })
  }
}

/**
 * Sets the document's title, appending a suffix if it is not already present.
 *
 * @param title - The main title to set for the document.
 * @param suffix - An optional suffix to append to the title.
 */
export function setTitle(title: string, suffix: string) {
  const finalTitle = title + (title.includes(suffix) ? '' : suffix)
  document.title = finalTitle
}
