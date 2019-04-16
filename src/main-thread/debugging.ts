/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Converts index-based worker messages to human-readable objects.
 *
 * Requires manual upkeep to keep consistency with messages and enums.
 * This allows us to continue using 'const enum' for enum inlining.
 * @see https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#9.4
 */

import { EventToWorker, MessageType, MessageToWorker, ValueSyncToWorker, BoundingClientRectToWorker } from '../transfer/Messages';
import { HydrateableNode, TransferredNode, TransferrableNodeIndex } from '../transfer/TransferrableNodes';
import { NodeContext } from './nodes';
import { TransferrableEvent } from '../transfer/TransferrableEvent';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { TransferrableSyncValue } from '../transfer/TransferrableSyncValue';
import { createReadableHydrateableRootNode } from './serialize';
import { WorkerDOMConfiguration } from './configuration';

/**
 * @param element
 */
export const readableHydrateableRootNode = (element: RenderableElement, config: WorkerDOMConfiguration): Object =>
  readableHydrateableNode(createReadableHydrateableRootNode(element, config));
/**
 * @param nodeContext {NodeContext}
 * @param node {TransferredNode}
 */
export const readableTransferredNode = (nodeContext: NodeContext, node: TransferredNode): Object | number | null =>
  (node != null && nodeContext.getNode(node[TransferrableNodeIndex.Index])) || node;

/**
 * @param node
 */
function readableHydrateableNode(node: HydrateableNode): Object {
  const out: any = {
    nodeType: node[TransferrableKeys.nodeType],
    name: node[TransferrableKeys.localOrNodeName],
    attributes: null,
    childNodes: null,
  };

  const attributes = node[TransferrableKeys.attributes];
  if (attributes) {
    out.attributes = attributes.map(attr => ({
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

/**
 * @param nodeContext {NodeContext}
 * @param event {TransferrableEvent}
 */
function readableTransferrableEvent(nodeContext: NodeContext, event: TransferrableEvent): Object {
  const value = (item?: null | number | boolean | TransferredNode): number | boolean | Object | null => {
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
function readableTransferrableSyncValue(nodeContext: NodeContext, value: TransferrableSyncValue): Object {
  const index = value[TransferrableKeys.index];
  return {
    target: nodeContext.getNode(index) || index,
    value: value[TransferrableKeys.value],
  };
}

/**
 * @param message
 */
export function readableMessageToWorker(nodeContext: NodeContext, message: MessageToWorker): Object {
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
  } else {
    return 'Unrecognized MessageToWorker type: ' + message[TransferrableKeys.type];
  }
}
