/**
 * Represents a lock on a cookie with a timestamp and an identifier.
 *
 * @interface CookieLock
 * @property {number} timestamp - The timestamp indicating when the lock was created.
 * @property {string} identifier - A unique identifier for the lock.
 */
export interface CookieLock {
  timestamp: number
  identifier: string
}
