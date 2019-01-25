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

import { getNode } from './nodes';
import { get as getString } from './strings';
import { EventToWorker, MessageFromWorker, MessageType, MessageToWorker, ValueSyncToWorker } from '../transfer/Messages';
import { HydrateableNode, TransferredNode } from '../transfer/TransferrableNodes';
import { TransferrableEvent } from '../transfer/TransferrableEvent';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { TransferrableSyncValue } from '../transfer/TransferrableSyncValue';
import { getHydrateableNodeString } from './serialize';

/**
 * Reverse mapping of src/worker-thread/MutationRecord.MutationRecord enum.
 */
const MUTATION_RECORD_TYPE_REVERSE_MAPPING = {
  '0': 'ATTRIBUTES',
  '1': 'CHARACTER_DATA',
  '2': 'CHILD_LIST',
  '3': 'PROPERTIES',
  '4': 'COMMAND',
};

/**
 * @param node
 */
export function readableHydrateableNode(node: HydrateableNode): Object {
  const out: any = {
    nodeType: node[TransferrableKeys.nodeType],
    nodeName: getHydrateableNodeString(node[TransferrableKeys.nodeName]),
  };
  const attributes = node[TransferrableKeys.attributes];
  if (attributes) {
    out['attributes'] = attributes.map(attr => {
      return {
        name: getHydrateableNodeString(attr[1]),
        value: getHydrateableNodeString(attr[2]),
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
 * @param message
 */
export function readableMessageFromWorker(message: MessageFromWorker): Object {
  const { data } = message;

  if (data[TransferrableKeys.type] === MessageType.MUTATE || data[TransferrableKeys.type] === MessageType.HYDRATE) {
    const mutations = data[TransferrableKeys.mutations];
    const mutate: any = {
      type: data[TransferrableKeys.type] === MessageType.MUTATE ? 'MUTATE' : 'HYDRATE',
      mutations: mutations.map(n => readableTransferrableMutationRecord(n)),
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
 * @param r
 */
function readableTransferrableMutationRecord(r: TransferrableMutationRecord): Object {
  const target = r[TransferrableKeys.target];
  const out: any = {
    type: MUTATION_RECORD_TYPE_REVERSE_MAPPING[r[TransferrableKeys.type]],
    target: getNode(target) || target,
  };
  const added = r[TransferrableKeys.addedNodes];
  if (added) {
    out['addedNodes'] = added.map(n => readableTransferredNode(n));
  }
  const removed = r[TransferrableKeys.removedNodes];
  if (removed) {
    out['removedNodes'] = removed.map(n => readableTransferredNode(n));
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
    out['attributeName'] = getString(attributeName);
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
    out['value'] = getString(value);
  }
  const oldValue = r[TransferrableKeys.oldValue];
  if (oldValue !== undefined) {
    out['oldValue'] = getString(oldValue);
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

/**
 * @param n
 */
function readableTransferredNode(n: TransferredNode): Object {
  const index = n[TransferrableKeys.index];
  return getNode(index) || index;
}

/**
 * @param message
 */
export function readableMessageToWorker(message: MessageToWorker): Object {
  if (isEvent(message)) {
    const event = message[TransferrableKeys.event];
    return {
      type: 'EVENT',
      event: readableTransferrableEvent(event),
    };
  } else if (isValueSync(message)) {
    const sync = message[TransferrableKeys.sync];
    return {
      type: 'SYNC',
      sync: readableTransferrableSyncValue(sync),
    };
  } else {
    return 'Unrecognized MessageToWorker type: ' + message[TransferrableKeys.type];
  }
}

/**
 * @param data
 */
function isEvent(message: EventToWorker | ValueSyncToWorker): message is EventToWorker {
  return message[TransferrableKeys.type] == MessageType.EVENT;
}

/**
 * @param data
 */
function isValueSync(message: EventToWorker | ValueSyncToWorker): message is ValueSyncToWorker {
  return message[TransferrableKeys.type] == MessageType.SYNC;
}

/**
 * @param e
 */
function readableTransferrableEvent(e: TransferrableEvent): Object {
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
    out['currentTarget'] = readableTransferredNode(currentTarget);
  }
  const target = e[TransferrableKeys.target];
  if (target) {
    out['target'] = readableTransferredNode(target);
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
function readableTransferrableSyncValue(v: TransferrableSyncValue): Object {
  const index = v[TransferrableKeys.index];
  return {
    target: getNode(index) || index,
    value: v[TransferrableKeys.value],
  };
}
