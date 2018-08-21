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
import { MutationRecord, MutationRecordType } from '../worker-thread/MutationRecord';
import { TransferrableMutationRecord } from './TransferrableRecord';
import { TransferrableNode, TransferredNode, HydrateableNode } from './TransferrableNodes';
import { MessageType, MutationFromWorker, HydrationFromWorker } from './Messages';
import { TransferrableKeys } from './TransferrableKeys';
import { consume as consumeNodes } from '../worker-thread/NodeMapping';
import { store as storeString, consume as consumeStrings } from '../worker-thread/StringMapping';
import { TransferrableEventSubscriptionChange } from './TransferrableEvent';

let document: Document;
let observing = false;
let hydrated = false;

const serializeNodes = (nodes: Array<Node>): Array<TransferredNode> => nodes.map(node => node._transferredFormat_);

/**
 *
 * @param mutations
 */
function serializeHydration(mutations: Array<MutationRecord>): HydrationFromWorker {
  consumeNodes();
  const hydratedNode: HydrateableNode = document.body.hydrate();
  const events: Array<TransferrableEventSubscriptionChange> = [];

  mutations.forEach(mutation => {
    if (mutation.type === MutationRecordType.COMMAND && mutation.addedEvents) {
      mutation.addedEvents.forEach(addEvent => {
        events.push(addEvent);
      });
    }
  });

  return {
    [TransferrableKeys.type]: MessageType.HYDRATE,
    [TransferrableKeys.strings]: consumeStrings(),
    [TransferrableKeys.nodes]: hydratedNode,
    [TransferrableKeys.addedEvents]: events,
  };
}

/**
 *
 * @param mutations
 */
function serializeMutations(mutations: MutationRecord[]): MutationFromWorker {
  const nodes: Array<TransferrableNode> = consumeNodes().map(node => node._creationFormat_);
  const transferrableMutations: TransferrableMutationRecord[] = [];
  mutations.forEach(mutation => {
    let transferable: TransferrableMutationRecord = {
      [TransferrableKeys.type]: mutation.type,
      [TransferrableKeys.target]: mutation.target._index_,
    };

    mutation.addedNodes && (transferable[TransferrableKeys.addedNodes] = serializeNodes(mutation.addedNodes));
    mutation.removedNodes && (transferable[TransferrableKeys.removedNodes] = serializeNodes(mutation.removedNodes));
    mutation.nextSibling && (transferable[TransferrableKeys.nextSibling] = mutation.nextSibling._transferredFormat_);
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
    [TransferrableKeys.type]: MessageType.MUTATE,
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
function handleMutations(incoming: MutationRecord[], postMessage?: Function): void {
  if (postMessage) {
    postMessage(hydrated === false ? serializeHydration(incoming) : serializeMutations(incoming));
  }
  hydrated = true;
}

/**
 *
 * @param doc
 * @param postMessage
 */
export function observe(doc: Document, postMessage: Function): void {
  if (!observing) {
    document = doc;
    new doc.defaultView.MutationObserver(mutations => handleMutations(mutations, postMessage)).observe(doc.body);
    observing = true;
  } else {
    console.error('observe() was called more than once.');
  }
}
