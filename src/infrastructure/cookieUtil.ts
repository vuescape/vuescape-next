import { useCookies } from '@vueuse/integrations'
import type { CookieLock } from '../models'

/**
 * Executes a given action with a lock mechanism to ensure that the action is not performed concurrently.
 * 
 * @template T - The type of the result returned by the action.
 * @param {string} lockCookieName - The name of the cookie used for the lock.
 * @param {string} domain - The domain for which the lock is applied.
 * @param {() => T} action - The action to be executed within the lock.
 * @returns {Promise<Awaited<T> | null>} - A promise that resolves to the result of the action if the lock is acquired, or null if the lock could not be acquired.
 */
export async function executeWithLockAsync<T>(
  lockCookieName: string,
  domain: string,
  action: () => T
): Promise<Awaited<T> | null> {
  if (await acquireLockWithRetryAsync(lockCookieName, domain)) {
    try {
      return await action()
    } finally {
      releaseLock(lockCookieName, domain)
    }
  }
  return null
}

/**
 * Attempts to acquire a lock by setting a cookie with the specified name and domain.
 * The lock is considered acquired if no existing lock is found or if the existing lock has expired.
 * The lock is valid for 5 seconds.
 *
 * @param lockCookieName - The name of the cookie to be used for the lock.
 * @param domain - The domain for which the cookie should be set.
 * @returns `true` if the lock was successfully acquired, `false` otherwise.
 */
export function acquireLock(lockCookieName: string, domain: string): boolean {
  const cookies = useCookies([lockCookieName])
  const lockCookie = cookies.get<CookieLock>(lockCookieName)
  const now = Date.now()
  const lockTimeout = 5000 // Timeout of 5 seconds

  // If no lock exists or the lock has expired, try to acquire the lock
  if (!lockCookie || now - lockCookie.timestamp > lockTimeout) {
    const newLock: CookieLock = { timestamp: now, identifier: window.location.hostname }
    cookies.set(lockCookieName, newLock, { domain })

    // Double-check to see if the lock was successfully acquired
    const updatedLockCookie = cookies.get<CookieLock>(lockCookieName)
    const lockData = updatedLockCookie ? updatedLockCookie : null

    if (
      lockData &&
      lockData.identifier === window.location.hostname &&
      lockData.timestamp === now
    ) {
      return true // Lock successfully acquired
    }
  }

  return false // Lock not acquired
}

/**
 * Attempts to acquire a lock by setting a cookie, retrying a specified number of times if necessary.
 *
 * @param lockCookieName - The name of the cookie to use for the lock.
 * @param domain - The domain for which the cookie is set.
 * @param retries - The number of times to retry acquiring the lock (default is 3).
 * @param minDelay - The minimum delay (in milliseconds) between retries (default is 50).
 * @param maxDelay - The maximum delay (in milliseconds) between retries (default is 200).
 * @returns A promise that resolves to `true` if the lock was acquired, or `false` if it was not acquired after the specified number of retries.
 */
export async function acquireLockWithRetryAsync(
  lockCookieName: string,
  domain: string,
  retries = 3,
  minDelay = 50,
  maxDelay = 200
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    if (acquireLock(lockCookieName, domain)) {
      return true // Lock acquired
    }
    // Wait for a random delay before retrying
    await sleep(randomDelay(minDelay, maxDelay))
  }
  return false // Lock not acquired after retries
}

/**
 * Releases a lock associated with a specific cookie if the current hostname holds it.
 *
 * @param cookieName - The name of the cookie that holds the lock.
 * @param domain - The domain for which the cookie is set.
 *
 * The function checks if the cookie exists and if the current hostname matches the identifier
 * stored in the cookie. If they match, the cookie is removed, effectively releasing the lock.
 * If they do not match, a message is logged indicating that the lock cannot be released.
 */
export function releaseLock(cookieName: string, domain: string) {
  const cookies = useCookies([cookieName])
  const lockCookie = cookies.get<CookieLock>(cookieName)
  if (lockCookie) {
    // Only release the lock if the current hostname holds it
    if (lockCookie.identifier === window.location.hostname) {
      cookies.remove(cookieName, { domain })
      // console.log('Lock released by', window.location.hostname)
    } else {
      // console.log('Cannot release lock: owned by', lockCookie.identifier)
    }
  }
}

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const randomDelay = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}
