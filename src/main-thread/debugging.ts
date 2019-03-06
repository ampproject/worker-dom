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

import { EventToWorker, MessageFromWorker, MessageType, MessageToWorker, ValueSyncToWorker, BoundingClientRectToWorker } from '../transfer/Messages';
import { HydrateableNode, TransferredNode } from '../transfer/TransferrableNodes';
import { NodeContext } from './nodes';
import { TransferrableEvent } from '../transfer/TransferrableEvent';
import { Strings } from './strings';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { TransferrableSyncValue } from '../transfer/TransferrableSyncValue';
import { createReadableHydrateableRootNode } from './serialize';

/**
 * Reverse mapping of src/worker-thread/MutationRecord.MutationRecord enum.
 */
const MUTATION_RECORD_TYPE_REVERSE_MAPPING = {
  '0': 'ATTRIBUTES',
  '1': 'CHARACTER_DATA',
  '2': 'CHILD_LIST',
  '3': 'PROPERTIES',
  '4': 'EVENT_SUBSCRIPTION',
  '5': 'GET_BOUNDING_CLIENT_RECT',
};

export class DebuggingContext {
  private strings: Strings;
  private nodeContext: NodeContext;

  constructor(strings: Strings, nodeContext: NodeContext) {
    this.strings = strings;
    this.nodeContext = nodeContext;
  }

  /**
   * @param element
   */
  readableHydrateableNodeFromElement(element: RenderableElement): Object {
    const node = createReadableHydrateableRootNode(element);
    return readableHydrateableNode(node);
  }

  /**
   * @param message
   */
  readableMessageFromWorker(message: MessageFromWorker): Object {
    const { data } = message;

    if (data[TransferrableKeys.type] === MessageType.MUTATE || data[TransferrableKeys.type] === MessageType.HYDRATE) {
      const mutations = data[TransferrableKeys.mutations];
      const mutate: any = {
        type: data[TransferrableKeys.type] === MessageType.MUTATE ? 'MUTATE' : 'HYDRATE',
        mutations: mutations.map(n => this.readableTransferrableMutationRecord(n)),
        // Omit 'strings' key.
      };
      // TODO(choumx): Like 'strings', I'm not sure 'nodes' is actually useful.
      // const nodes = data[TransferrableKeys.nodes];
      // mutate['nodes'] = nodes.map(n => readableTransferrableNode(n));
      return mutate;
    } else {
      return 'Unrecognized MessageFromWorker type: ' + data[TransferrableKeys.type];
    }
  }

  /**
   * @param message
   */
  readableMessageToWorker(message: MessageToWorker): Object {
    if (isEvent(message)) {
      const event = message[TransferrableKeys.event];
      return {
        type: 'EVENT',
        event: readableTransferrableEvent(this.nodeContext, event),
      };
    } else if (isValueSync(message)) {
      const sync = message[TransferrableKeys.sync];
      return {
        type: 'SYNC',
        sync: readableTransferrableSyncValue(this.nodeContext, sync),
      };
    } else if (isBoundingClientRect(message)) {
      return {
        type: 'GET_BOUNDING_CLIENT_RECT',
        target: readableTransferredNode(this.nodeContext, message[TransferrableKeys.target]),
      };
    } else {
      return 'Unrecognized MessageToWorker type: ' + message[TransferrableKeys.type];
    }
  }

  /**
   * @param r
   */
  private readableTransferrableMutationRecord(r: TransferrableMutationRecord): Object {
    const target = r[TransferrableKeys.target];

    const out: any = {
      type: MUTATION_RECORD_TYPE_REVERSE_MAPPING[r[TransferrableKeys.type]],
      target: this.nodeContext.getNode(target) || target,
    };
    const added = r[TransferrableKeys.addedNodes];
    if (added) {
      out['addedNodes'] = added.map(n => readableTransferredNode(this.nodeContext, n));
    }
    const removed = r[TransferrableKeys.removedNodes];
    if (removed) {
      out['removedNodes'] = removed.map(n => readableTransferredNode(this.nodeContext, n));
    }
    const previousSibling = r[TransferrableKeys.previousSibling];
    if (previousSibling) {
      out['previousSibling'] = previousSibling;
    }
    const nextSibling = r[TransferrableKeys.nextSibling];
    if (nextSibling) {
      out['nextSibling'] = nextSibling;
    }
    const attributeName = r[TransferrableKeys.attributeName];
    if (attributeName !== undefined) {
      out['attributeName'] = this.strings.get(attributeName);
    }
    const attributeNamespace = r[TransferrableKeys.attributeNamespace];
    if (attributeNamespace !== undefined) {
      out['attributeNamespace'] = attributeNamespace;
    }
    const propertyName = r[TransferrableKeys.propertyName];
    if (propertyName !== undefined) {
      out['propertyName'] = propertyName;
    }
    const value = r[TransferrableKeys.value];
    if (value !== undefined) {
      out['value'] = this.strings.get(value);
    }
    const oldValue = r[TransferrableKeys.oldValue];
    if (oldValue !== undefined) {
      out['oldValue'] = this.strings.get(oldValue);
    }
    const addedEvents = r[TransferrableKeys.addedEvents];
    if (addedEvents !== undefined) {
      out['addedEvents'] = addedEvents;
    }
    const removedEvents = r[TransferrableKeys.removedEvents];
    if (removedEvents !== undefined) {
      out['removedEvents'] = removedEvents;
    }
    return out;
  }
}

/**
 * @param node
 */
function readableHydrateableNode(node: HydrateableNode): Object {
  const out: any = {
    nodeType: node[TransferrableKeys.nodeType],
    name: node[TransferrableKeys.localOrNodeName],
  };
  const attributes = node[TransferrableKeys.attributes];
  if (attributes) {
    out['attributes'] = attributes.map(attr => {
      return {
        name: attr[1],
        value: attr[2],
      };
    });
  }
  const childNodes = node[TransferrableKeys.childNodes];
  if (childNodes) {
    out['childNodes'] = childNodes.map(child => readableHydrateableNode(child));
  }
  return out;
}

/**
 * @param n
 */
function readableTransferredNode(nodeContext: NodeContext, n: TransferredNode): Object {
  const index = n[TransferrableKeys.index];
  return nodeContext.getNode(index) || index;
}

/**
 * @param data
 */
function isEvent(message: MessageToWorker): message is EventToWorker {
  return message[TransferrableKeys.type] == MessageType.EVENT;
}

/**
 * @param data
 */
function isValueSync(message: MessageToWorker): message is ValueSyncToWorker {
  return message[TransferrableKeys.type] == MessageType.SYNC;
}

/**
 * @param data
 */
function isBoundingClientRect(message: MessageToWorker): message is BoundingClientRectToWorker {
  return message[TransferrableKeys.type] === MessageType.GET_BOUNDING_CLIENT_RECT;
}

/**
 * @param e
 */
function readableTransferrableEvent(nodeContext: NodeContext, e: TransferrableEvent): Object {
  const out: any = {
    type: e[TransferrableKeys.type],
  };
  const bubbles = e[TransferrableKeys.bubbles];
  if (bubbles !== undefined) {
    out['bubbles'] = bubbles;
  }
  const cancelable = e[TransferrableKeys.cancelable];
  if (cancelable !== undefined) {
    out['cancelable'] = cancelable;
  }
  const cancelBubble = e[TransferrableKeys.cancelBubble];
  if (cancelBubble !== undefined) {
    out['cancelBubble'] = cancelBubble;
  }
  const defaultPrevented = e[TransferrableKeys.defaultPrevented];
  if (defaultPrevented !== undefined) {
    out['defaultPrevented'] = defaultPrevented;
  }
  const eventPhase = e[TransferrableKeys.eventPhase];
  if (eventPhase !== undefined) {
    out['eventPhase'] = eventPhase;
  }
  const isTrusted = e[TransferrableKeys.isTrusted];
  if (isTrusted !== undefined) {
    out['isTrusted'] = isTrusted;
  }
  const returnValue = e[TransferrableKeys.returnValue];
  if (returnValue !== undefined) {
    out['returnValue'] = returnValue;
  }
  const currentTarget = e[TransferrableKeys.currentTarget];
  if (currentTarget) {
    out['currentTarget'] = readableTransferredNode(nodeContext, currentTarget);
  }
  const target = e[TransferrableKeys.target];
  if (target) {
    out['target'] = readableTransferredNode(nodeContext, target);
  }
  const scoped = e[TransferrableKeys.scoped];
  if (scoped !== undefined) {
    out['scoped'] = scoped;
  }
  const keyCode = e[TransferrableKeys.keyCode];
  if (keyCode !== undefined) {
    out['keyCode'] = keyCode;
  }
  return out;
}

/**
 * @param v
 */
function readableTransferrableSyncValue(nodeContext: NodeContext, v: TransferrableSyncValue): Object {
  const index = v[TransferrableKeys.index];
  return {
    target: nodeContext.getNode(index) || index,
    value: v[TransferrableKeys.value],
  };
}
