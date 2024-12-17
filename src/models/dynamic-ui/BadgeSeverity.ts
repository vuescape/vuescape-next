
/**
 * Represents the severity levels for a badge component.
 * 
 * The `BadgeSeverity` type can be one of the following string values:
 * - `'secondary'`: Indicates a secondary level of importance.
 * - `'info'`: Indicates informational content.
 * - `'success'`: Indicates a successful operation or status.
 * - `'warn'`: Indicates a warning that requires attention.
 * - `'danger'`: Indicates a dangerous or error state.
 * - `'contrast'`: Indicates to display using high contrast such as black and white.
 * - `null`: Indicates no severity level. Will default to 'contrast'
 */
export type BadgeSeverity = 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null
