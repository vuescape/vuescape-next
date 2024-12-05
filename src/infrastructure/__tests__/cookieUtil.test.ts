/* eslint-disable */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCookies } from '@vueuse/integrations'
import {
  executeWithLockAsync,
  acquireLock,
  acquireLockWithRetryAsync,
  releaseLock
} from '../cookieUtil'

vi.mock('@vueuse/integrations')

describe('cookieUtil', () => {
  let cookiesMock: any

  beforeEach(() => {
    cookiesMock = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn()
    }
    useCookies.mockReturnValue(cookiesMock)
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('executeWithLockAsync', () => {
    it('executes action if lock is acquired', async () => {
      vi.spyOn(global, 'window', 'get').mockReturnValue({ location: { hostname: 'test.com' } })
      cookiesMock.get.mockReturnValue(null)
      cookiesMock.set.mockImplementation(() => {
        cookiesMock.get.mockReturnValue({ timestamp: Date.now(), identifier: 'test.com' })
      })

      const action = vi.fn().mockResolvedValue('result')
      const result = await executeWithLockAsync('lock', 'test.com', action)

      expect(result).toBe('result')
      expect(action).toHaveBeenCalled()
      expect(cookiesMock.set).toHaveBeenCalled()
      expect(cookiesMock.remove).toHaveBeenCalled()
    })

    it('returns null if lock is not acquired', async () => {
      cookiesMock.get.mockReturnValue({ timestamp: Date.now(), identifier: 'other.com' })

      const action = vi.fn()
      const result = await executeWithLockAsync('lock', 'test.com', action)

      expect(result).toBeNull()
      expect(action).not.toHaveBeenCalled()
    })
  })

  describe('acquireLockWithRetryAsync', () => {
    it('fails to acquire lock after retries', async () => {
      vi.spyOn(global, 'window', 'get').mockReturnValue({ location: { hostname: 'test.com' } })
      cookiesMock.get.mockReturnValue({ timestamp: Date.now(), identifier: 'other.com' })

      const result = await acquireLockWithRetryAsync('lock', 'test.com', 2, 10, 20)

      expect(result).toBe(false)
      expect(cookiesMock.set).not.toHaveBeenCalled()
    })
  })

  describe('releaseLock', () => {
    it('releases lock if current hostname holds it', () => {
      vi.spyOn(global, 'window', 'get').mockReturnValue({ location: { hostname: 'test.com' } })
      cookiesMock.get.mockReturnValue({ timestamp: Date.now(), identifier: 'test.com' })

      releaseLock('lock', 'test.com')

      expect(cookiesMock.remove).toHaveBeenCalled()
    })

    it('does not release lock if current hostname does not hold it', () => {
      vi.spyOn(global, 'window', 'get').mockReturnValue({ location: { hostname: 'test.com' } })
      cookiesMock.get.mockReturnValue({ timestamp: Date.now(), identifier: 'other.com' })

      releaseLock('lock', 'test.com')

      expect(cookiesMock.remove).not.toHaveBeenCalled()
    })
  })
})
