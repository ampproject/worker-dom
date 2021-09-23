/**
 * @fileoverview Converts index-based worker messages to human-readable objects.
 *
 * Requires manual upkeep to keep consistency with messages and enums.
 * This allows us to continue using 'const enum' for enum inlining.
 * @see https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#9.4
 */

import {
  EventToWorker,
  MessageType,
  MessageToWorker,
  ValueSyncToWorker,
  BoundingClientRectToWorker,
  StorageValueToWorker,
} from '../transfer/Messages';
import { HydrateableNode, TransferredNode, TransferrableNodeIndex } from '../transfer/TransferrableNodes';
import { NodeContext } from './nodes';
import { TransferrableEvent } from '../transfer/TransferrableEvent';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { TransferrableSyncValue } from '../transfer/TransferrableSyncValue';
import { createReadableHydrateableRootNode } from './serialize';
import { WorkerDOMConfiguration } from './configuration';
import { WorkerContext } from './worker';

/**
 * @param element
 */
export const readableHydrateableRootNode = (element: RenderableElement, config: WorkerDOMConfiguration, workerContext: WorkerContext): {} =>
  readableHydrateableNode(createReadableHydrateableRootNode(element, config, workerContext));
/**
 * @param nodeContext {NodeContext}
 * @param node {TransferredNode}
 */
export const readableTransferredNode = (nodeContext: NodeContext, node: TransferredNode): {} | number | null =>
  (node != null && nodeContext.getNode(node[TransferrableNodeIndex.Index])) || node;

/**
 * @param node
 */
function readableHydrateableNode(node: HydrateableNode): {} {
  const out: any = {
    nodeType: node[TransferrableKeys.nodeType],
    name: node[TransferrableKeys.localOrNodeName],
    attributes: null,
    childNodes: null,
  };

  const attributes = node[TransferrableKeys.attributes];
  if (attributes) {
    out.attributes = attributes.map((attr) => ({
      name: attr[1],
      value: attr[2],
    }));
  }

  const childNodes = node[TransferrableKeys.childNodes];
  if (childNodes) {
    out.childNodes = childNodes.map(readableHydrateableNode);
  }

  return out;
}

/**
 * @param message {MessageToWorker}
 */
const isEvent = (message: MessageToWorker): message is EventToWorker => message[TransferrableKeys.type] == MessageType.EVENT;
const isValueSync = (message: MessageToWorker): message is ValueSyncToWorker => message[TransferrableKeys.type] == MessageType.SYNC;
const isBoundingClientRect = (message: MessageToWorker): message is BoundingClientRectToWorker =>
  message[TransferrableKeys.type] === MessageType.GET_BOUNDING_CLIENT_RECT;
const isGetStorage = (message: MessageToWorker): message is StorageValueToWorker => message[TransferrableKeys.type] === MessageType.GET_STORAGE;

/**
 * @param nodeContext {NodeContext}
 * @param event {TransferrableEvent}
 */
function readableTransferrableEvent(nodeContext: NodeContext, event: TransferrableEvent): {} {
  const value = (item?: null | number | boolean | TransferredNode): number | boolean | {} | null => {
    if (typeof item === 'number' || typeof item === 'boolean') {
      return item !== undefined ? item : null;
    }
    return item !== undefined && item !== null ? readableTransferredNode(nodeContext, item) : null;
  };

  return {
    type: event[TransferrableKeys.type],
    bubbles: value(event[TransferrableKeys.bubbles]),
    cancelable: value(event[TransferrableKeys.cancelable]),
    cancelBubble: value(event[TransferrableKeys.cancelBubble]),
    defaultPrevented: value(event[TransferrableKeys.defaultPrevented]),
    eventPhase: value(event[TransferrableKeys.eventPhase]),
    isTrusted: value(event[TransferrableKeys.isTrusted]),
    returnValue: value(event[TransferrableKeys.returnValue]),
    currentTarget: value(event[TransferrableKeys.currentTarget]),
    target: value(event[TransferrableKeys.target]),
    scoped: value(event[TransferrableKeys.scoped]),
    keyCode: value(event[TransferrableKeys.keyCode]),
  };
}

/**
 * @param nodeContext {NodeContext}
 * @param value {TransferrableSyncValue}
 */
function readableTransferrableSyncValue(nodeContext: NodeContext, value: TransferrableSyncValue): {} {
  const index = value[TransferrableKeys.index];
  return {
    target: nodeContext.getNode(index) || index,
    value: value[TransferrableKeys.value],
  };
}

/**
 * @param message
 */
export function readableMessageToWorker(nodeContext: NodeContext, message: MessageToWorker): {} {
  if (isEvent(message)) {
    const event = message[TransferrableKeys.event];
    return {
      type: 'EVENT',
      event: readableTransferrableEvent(nodeContext, event),
    };
  } else if (isValueSync(message)) {
    const sync = message[TransferrableKeys.sync];
    return {
      type: 'SYNC',
      sync: readableTransferrableSyncValue(nodeContext, sync),
    };
  } else if (isBoundingClientRect(message)) {
    return {
      type: 'GET_BOUNDING_CLIENT_RECT',
      target: readableTransferredNode(nodeContext, message[TransferrableKeys.target]),
    };
  } else if (isGetStorage(message)) {
    return {
      type: 'GET_STORAGE',
      key: message[TransferrableKeys.storageKey],
      location: message[TransferrableKeys.storageLocation],
      value: message[TransferrableKeys.value],
    };
  } else {
    return 'Unrecognized MessageToWorker type: ' + message[TransferrableKeys.type];
  }
}
