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

import { getNode } from './nodes';
import { getString } from './strings';
import { TransferrableNode, TransferredNode } from '../transfer/TransferrableNodes';
import { HydrationFromWorker, MessageFromWorker, MessageType, MutationFromWorker } from '../transfer/Messages';
import { MutationRecordType } from '../worker-thread/MutationRecord';
import { TransferrableMutationRecord } from '../transfer/TransferrableRecord';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

export function readableMessageFromWorker({ data }: MessageFromWorker): Object {
  function isHydration(d: MutationFromWorker | HydrationFromWorker): d is HydrationFromWorker {
    return data[TransferrableKeys.type] == MessageType.HYDRATE;
  }
  function isMutation(d: MutationFromWorker | HydrationFromWorker): d is MutationFromWorker {
    return data[TransferrableKeys.type] == MessageType.MUTATE;
  }
  if (isHydration(data)) {
    return {
      type: 'HYDRATE',
      nodes: data[TransferrableKeys.nodes],
      addEvents: data[TransferrableKeys.addedEvents],
      // Omit 'strings' key.
    };
  } else if (isMutation(data)) {
    const nodes = data[TransferrableKeys.nodes];
    const mutations = data[TransferrableKeys.mutations];
    return {
      type: 'MUTATE',
      nodes: nodes.map(n => readableTransferrableNode(n)),
      mutations: mutations.map(n => readableTransferrableMutationRecord(n)),
      // Omit 'strings' key.
    };
  } else {
    throw new Error('Unrecognized MessageFromWorker:' + data);
  }
}

// function readableHydratableNode(node: HydrateableNode): Object {
//   return Object.assign(readableTransferrableNode(node), {
//     'attributes': node[TransferrableKeys.attributes],
//     'childNodes': node[TransferrableKeys.childNodes],
//   });
// }

function readableTransferrableNode(node: TransferrableNode): Object {
  const nodeTypeNames: any = {
    '1': 'ELEMENT',
    '3': 'TEXT',
    '8': 'COMMENT',
    '9': 'DOCUMENT',
  };
  const nodeType = node[TransferrableKeys.nodeType];
  return {
    nodeType: nodeTypeNames[nodeType] || nodeType,
    nodeName: getString(node[TransferrableKeys.nodeName]),
    _index_: node[TransferrableKeys._index_],
    transferred: node[TransferrableKeys.transferred],
    // TODO: textContent, namespaceURI.
  };
}

/**
 * @param r
 */
function readableTransferrableMutationRecord(r: TransferrableMutationRecord): Object {
  const target = r[TransferrableKeys.target];
  const out: any = {
    type: MutationRecordType[r[TransferrableKeys.type]],
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
  if (r[TransferrableKeys.previousSibling]) {
    out['previousSibling'] = r[TransferrableKeys.previousSibling];
  }
  if (r[TransferrableKeys.nextSibling]) {
    out['nextSibling'] = r[TransferrableKeys.nextSibling];
  }
  const attributeName = r[TransferrableKeys.attributeName];
  if (attributeName) {
    out['attributeName'] = getString(attributeName);
  }
  if (r[TransferrableKeys.attributeNamespace]) {
    out['attributeNamespace'] = r[TransferrableKeys.attributeNamespace];
  }
  if (r[TransferrableKeys.propertyName]) {
    out['propertyName'] = r[TransferrableKeys.propertyName];
  }
  const value = r[TransferrableKeys.value];
  if (value) {
    out['value'] = getString(value);
  }
  const oldValue = r[TransferrableKeys.oldValue];
  if (oldValue) {
    out['oldValue'] = getString(oldValue);
  }
  if (r[TransferrableKeys.addedEvents]) {
    out['addedEvents'] = r[TransferrableKeys.addedEvents];
  }
  if (r[TransferrableKeys.removedEvents]) {
    out['removedEvents'] = r[TransferrableKeys.removedEvents];
  }
  return out;
}

function readableTransferredNode(n: TransferredNode): Object {
  const index = n[TransferrableKeys._index_];
  return getNode(index) || index;
}
