import { Node } from './dom/Node';

// MutationRecord interface is modification and extension of the spec version.
// It supports capturing property changes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
export interface MutationRecord {
  readonly target: Node;
  readonly addedNodes?: Array<Node>;
  readonly removedNodes?: Array<Node>;
  readonly previousSibling?: Node | null;
  readonly nextSibling?: Node | null;
  readonly attributeName?: string | null;
  readonly attributeNamespace?: string | null;
  readonly oldValue?: string | null;

  // MutationRecord Extensions
  readonly type: MutationRecordType;
  readonly value?: string | null;
}

// Add a new types of MutationRecord to capture changes not normally reported by MutationObserver on Nodes.
// 1. PROPERTIES to enable capture of Node.property changes
// 2. COMMAND to enable capture of requests for data for Worker from Main Thread
export const enum MutationRecordType {
  ATTRIBUTES = 0,
  CHARACTER_DATA = 1,
  CHILD_LIST = 2,
}
