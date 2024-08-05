/**
 * Creates a promise that resolves after a specified delay.
 *
 * @param delay - The delay in milliseconds.
 * @returns A promise that resolves after the specified delay.
 */
export const sleepAsync = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))
