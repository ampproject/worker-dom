import { Node } from './dom/Node';
import { phase } from './phase';
import { Phase } from '../transfer/Phase';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

let count: number = 0;
let transfer: Array<Node> = [];
const mapping: Map<number, Node> = new Map();

/**
 * Override the store for a node during the initialization phase.
 * @param node Node to store and modify with index
 * @param override Override number to use as the identifier.
 *
 * NOTE: THIS IS ONLY TO BE USED DURING INITIALIZATION.
 */
export function storeOverride(node: Node, override: number): number {
  // Server version of the lib never transfers.
  if (process.env.SERVER) {
    return 0;
  }

  if (phase === Phase.Initializing) {
    mapping.set((node[TransferrableKeys.index] = override), node);
    count = Math.max(count, override);
  }
  return override;
}

/**
 * Stores a node in mapping, and makes the index available on the Node directly.
 * @param node Node to store and modify with index
 * @return index Node was stored with in mapping
 */
export function store(node: Node): number {
  // Server version of the lib never transfers.
  if (process.env.SERVER) {
    return 0;
  }

  if (node[TransferrableKeys.index] !== undefined) {
    return node[TransferrableKeys.index];
  }

  mapping.set((node[TransferrableKeys.index] = ++count), node);
  if (phase > Phase.Initializing) {
    // After Initialization, include all future dom node creation into the list for next transfer.
    transfer.push(node);
  }
  return count;
}

/**
 * Retrieves a node based on an index.
 * @param index location in map to retrieve a Node for
 * @return either the Node represented in index position, or null if not available.
 */
export function get(index: number | null): Node | null {
  // mapping has a 1 based index, since on first store we ++count before storing.
  return (!!index && mapping.get(index)) || null;
}

/**
 * Returns nodes registered but not yet transferred.
 * Side effect: Resets the transfer array to default value, to prevent passing the same values multiple times.
 */
export function consume(): Array<Node> {
  const copy = transfer;
  transfer = [];
  return copy;
}
