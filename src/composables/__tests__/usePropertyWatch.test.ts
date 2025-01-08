import { describe, it, expect, vi } from 'vitest'
import { reactive, ref, nextTick } from 'vue'
import { usePropertyWatch } from '../usePropertyWatch'

describe('usePropertyWatch', () => {
  describe('with reactive source', () => {
    it('should call the handler when a reactive property changes', async () => {
      const state = reactive({ count: 0 })
      const handler = vi.fn()

      usePropertyWatch(state, {
        count: (newValue, oldValue) => handler(newValue, oldValue)
      })

      state.count = 1
      await nextTick()

      expect(handler).toHaveBeenCalledOnce()
      expect(handler).toHaveBeenCalledWith(1, 0)
    })

    it('should not call the handler for unrelated changes', async () => {
      const state = reactive({ count: 0, name: 'Test' })
      const handler = vi.fn()

      usePropertyWatch(state, {
        count: (newValue, oldValue) => handler(newValue, oldValue)
      })

      state.name = 'Updated'
      await nextTick()

      expect(handler).not.toHaveBeenCalled()
    })

    it('should call the correct handler for multiple properties', async () => {
      const state = reactive({ count: 0, name: 'Test' })
      const countHandler = vi.fn()
      const nameHandler = vi.fn()

      usePropertyWatch(state, {
        count: (newValue, oldValue) => countHandler(newValue, oldValue),
        name: (newValue, oldValue) => nameHandler(newValue, oldValue)
      })

      state.count = 5
      await nextTick()

      state.name = 'Updated'
      await nextTick()

      expect(countHandler).toHaveBeenCalledOnce()
      expect(countHandler).toHaveBeenCalledWith(5, 0)

      expect(nameHandler).toHaveBeenCalledOnce()
      expect(nameHandler).toHaveBeenCalledWith('Updated', 'Test')
    })

    it('should warn about invalid keys', () => {
      const state = reactive({ count: 0 })
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      usePropertyWatch(state, {
        invalidKey: () => {} // Invalid key
      } as any)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[usePropertyWatch] Invalid key detected: invalidKey'
      )

      consoleWarnSpy.mockRestore()
    })

    it('should allow undefined oldValue on initial call', async () => {
      const state = reactive({ count: 0 })
      const handler = vi.fn()

      usePropertyWatch(state, {
        count: (newValue, oldValue) => handler(newValue, oldValue)
      })

      state.count = 5
      await nextTick()

      expect(handler).toHaveBeenCalledWith(5, 0)

      state.count = 10
      await nextTick()

      expect(handler).toHaveBeenCalledWith(10, 5)
    })
  })

  describe('with ref source', () => {
    it('should call the handler when a property inside a ref changes', async () => {
      const state = ref({ count: 0 })
      const handler = vi.fn()

      usePropertyWatch(state, {
        count: (newValue, oldValue) => handler(newValue, oldValue)
      })

      state.value.count = 10
      await nextTick()

      expect(handler).toHaveBeenCalledOnce()
      expect(handler).toHaveBeenCalledWith(10, 0)
    })

    it('should not call the handler for unrelated changes in a ref', async () => {
      const state = ref({ count: 0, name: 'Test' })
      const handler = vi.fn()

      usePropertyWatch(state, {
        count: (newValue, oldValue) => handler(newValue, oldValue)
      })

      state.value.name = 'Updated'
      await nextTick()

      expect(handler).not.toHaveBeenCalled()
    })

    it('should call the correct handler for multiple properties in a ref', async () => {
      const state = ref({ count: 0, name: 'Test' })
      const countHandler = vi.fn()
      const nameHandler = vi.fn()

      usePropertyWatch(state, {
        count: (newValue, oldValue) => countHandler(newValue, oldValue),
        name: (newValue, oldValue) => nameHandler(newValue, oldValue)
      })

      state.value.count = 5
      await nextTick()

      state.value.name = 'Updated'
      await nextTick()

      expect(countHandler).toHaveBeenCalledOnce()
      expect(countHandler).toHaveBeenCalledWith(5, 0)

      expect(nameHandler).toHaveBeenCalledOnce()
      expect(nameHandler).toHaveBeenCalledWith('Updated', 'Test')
    })

    it('should warn about invalid keys in a ref source', () => {
      const state = ref({ count: 0 })
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      usePropertyWatch(state, {
        invalidKey: () => {} // Invalid key
      } as any)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[usePropertyWatch] Invalid key detected: invalidKey'
      )

      consoleWarnSpy.mockRestore()
    })

    it('should allow undefined oldValue on initial call in a ref', async () => {
      const state = ref({ count: 0 })
      const handler = vi.fn()

      usePropertyWatch(state, {
        count: (newValue, oldValue) => handler(newValue, oldValue)
      })

      state.value.count = 5
      await nextTick()

      expect(handler).toHaveBeenCalledWith(5, 0)

      state.value.count = 10
      await nextTick()

      expect(handler).toHaveBeenCalledWith(10, 5)
    })
  })
})
