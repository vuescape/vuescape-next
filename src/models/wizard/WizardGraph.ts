import type { WizardNode } from './WizardNode'

/**
 * Represents a graph structure where each key is a string identifier
 * and the corresponding value is a `WizardNode`.
 *
 * This type is used to model relationships between nodes in a wizard-like
 * flow or process.
 *
 * @typeParam string - The key representing the unique identifier for each node.
 * @typeParam WizardNode - The value representing the node associated with the key.
 */
export type WizardGraph = Record<string, WizardNode>
