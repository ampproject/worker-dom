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

import { Node } from '../worker-thread/dom/Node';
import { Document } from '../worker-thread/dom/Document';
import { MutationRecord } from '../worker-thread/MutationRecord';
import { TransferrableMutationRecord } from './TransferrableRecord';
import { TransferrableNode, TransferredNode } from './TransferrableNodes';
import { MessageType, MutationFromWorker } from './Messages';
import { TransferrableKeys } from './TransferrableKeys';
import { consume as consumeNodes } from '../worker-thread/nodes';
import { store as storeString, consume as consumeStrings } from '../worker-thread/strings';
import { phase, set as setPhase, Phases } from '../transfer/phase';

let observing = false;

const serializeNodes = (nodes: Array<Node>): Array<TransferredNode> => nodes.map(node => node[TransferrableKeys.transferredFormat]);

/**
 *
 * @param mutations
 */
function serializeMutations(mutations: MutationRecord[]): MutationFromWorker {
  const nodes: Array<TransferrableNode> = consumeNodes().map(node => node[TransferrableKeys.creationFormat]);
  const transferrableMutations: TransferrableMutationRecord[] = [];
  const type = phase === Phases.Mutating ? MessageType.MUTATE : MessageType.HYDRATE;

  mutations.forEach(mutation => {
    let transferable: TransferrableMutationRecord = {
      [TransferrableKeys.type]: mutation.type,
      [TransferrableKeys.target]: mutation.target[TransferrableKeys.index],
    };

    mutation.addedNodes && (transferable[TransferrableKeys.addedNodes] = serializeNodes(mutation.addedNodes));
    mutation.removedNodes && (transferable[TransferrableKeys.removedNodes] = serializeNodes(mutation.removedNodes));
    mutation.nextSibling && (transferable[TransferrableKeys.nextSibling] = mutation.nextSibling[TransferrableKeys.transferredFormat]);
    mutation.attributeName != null && (transferable[TransferrableKeys.attributeName] = storeString(mutation.attributeName));
    mutation.attributeNamespace != null && (transferable[TransferrableKeys.attributeNamespace] = storeString(mutation.attributeNamespace));
    mutation.oldValue != null && (transferable[TransferrableKeys.oldValue] = storeString(mutation.oldValue));
    mutation.propertyName && (transferable[TransferrableKeys.propertyName] = storeString(mutation.propertyName));
    mutation.value != null && (transferable[TransferrableKeys.value] = storeString(mutation.value));
    mutation.addedEvents && (transferable[TransferrableKeys.addedEvents] = mutation.addedEvents);
    mutation.removedEvents && (transferable[TransferrableKeys.removedEvents] = mutation.removedEvents);

    transferrableMutations.push(transferable);
  });
  return {
    [TransferrableKeys.type]: type,
    [TransferrableKeys.strings]: consumeStrings(),
    [TransferrableKeys.nodes]: nodes,
    [TransferrableKeys.mutations]: transferrableMutations,
  };
}

/**
 *
 * @param incoming
 * @param postMessage
 */
function handleMutations(incoming: Array<MutationRecord>, postMessage?: Function): void {
  if (postMessage) {
    postMessage(serializeMutations(incoming));
    // Only first set of mutations are sent in a "HYDRATE" message type.
    // Afterwards, we enter "MUTATING" phase and subsequent mutations are sent in "MUTATE" message type.
    setPhase(Phases.Mutating);
  }
}

/**
 *
 * @param doc
 * @param postMessage
 */
export function observe(doc: Document, postMessage: Function): void {
  if (!observing) {
    new doc.defaultView.MutationObserver(mutations => handleMutations(mutations, postMessage)).observe(doc.body);
    observing = true;
  } else {
    console.error('observe called more than once');
  }
}
