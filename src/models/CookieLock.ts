/**
 * Represents a lock on a cookie with a timestamp and an identifier.
 */
export interface CookieLock {
  /**
   * The timestamp indicating when the lock was created.
   */
  timestamp: number;

  /**
   * A unique identifier for the lock.
   */
  identifier: string;
}
