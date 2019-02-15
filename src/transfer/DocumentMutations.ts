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
import { TransferrableMutationRecords } from './TransferrableRecord';
import { TransferrableNode } from './TransferrableNodes';
import { MessageType, MutationFromWorker } from './Messages';
import { TransferrableKeys } from './TransferrableKeys';
import { consume as consumeNodes } from '../worker-thread/nodes';
import { store as storeString, consume as consumeStrings } from '../worker-thread/strings';
import { phase, set as setPhase, Phases } from '../transfer/phase';
import { NumericBoolean } from '../utils';

let observing = false;

const serializeNodes = (nodes: Array<Node>): Array<number> => nodes.map(node => node[TransferrableKeys.transferredFormat][0]);

const numericBooleanHelper = (condition?: any | null) => (condition ? NumericBoolean.TRUE : NumericBoolean.FALSE);
const transferrableNodeHelper = (node?: Node | null) => (node ? node[TransferrableKeys.index] : 0);
const transferrableStringHelper = (value?: string | null): number => (value ? storeString(value) : 0);
/**
 *
 * @param mutations
 */
function serializeMutations(mutations: MutationRecord[]): MutationFromWorker {
  const nodes: Array<TransferrableNode> = consumeNodes().map(node => node[TransferrableKeys.creationFormat]);
  const type = phase === Phases.Mutating ? MessageType.MUTATE : MessageType.HYDRATE;
  // let transferrableMutations: TransferrableMutationRecords = [];
  const buffer: ArrayBuffer = new ArrayBuffer(256);
  const view: DataView = new DataView(buffer);
  let position: number = 0;

  /* Structure 
  [
    UInt8,  // MutationRecordType
    UInt32, // MutationRecordTarget (Identifier)
    UInt8,  // AddedNodeCount
    UInt8,  // RemovedNodeCount
    UInt8,  // AddedEventCount
    UInt8,  // RemovedEventCount
    UInt32, // PreviousSibling (Identifier, 0 = not used)
    UInt32, // NextSibling (Identifier, 0 = not used)
    UInt32, // AttributeName (Identifier, 0 = not used)
    UInt32, // AttributeNamespace (Identifier, 0 = not used)
    UInt32, // PropertyName (Identifier, 0 = not used)
    UInt32, // NewValue (Identifer, 0 = not used)
    UInt32, // OldValue (Identifer, 0 = not used)
  ]
  // Structure [MutationRecordType]
  /*

  // Following value 17 is a spread of values, unrepresentable in TypeScript.
  // ...AddedNodes,
  // ...RemovedNodes,
  // ...AddedEvents,
  // ...RemovedEvents,

  */

  console.log('serialize mutations', mutations);
  mutations.forEach(mutation => {
    view.setInt.push(
      mutation.type,
      mutation.target[TransferrableKeys.index],
      (mutation.addedNodes || []).length,
      (mutation.removedNodes || []).length,
      (mutation.addedEvents || []).length,
      (mutation.removedEvents || []).length,
      numericBooleanHelper(mutation.previousSibling),
      transferrableNodeHelper(mutation.previousSibling),
      numericBooleanHelper(mutation.nextSibling),
      transferrableNodeHelper(mutation.nextSibling),

      numericBooleanHelper(mutation.attributeName),
      transferrableStringHelper(mutation.attributeName),
      numericBooleanHelper(mutation.attributeNamespace),
      transferrableStringHelper(mutation.attributeNamespace),
      numericBooleanHelper(mutation.propertyName),
      transferrableStringHelper(mutation.propertyName),
      transferrableStringHelper(mutation.value),
      transferrableStringHelper(mutation.oldValue),

      ...serializeNodes(mutation.addedNodes || []),
      ...serializeNodes(mutation.removedNodes || []),
      ...[].concat.apply([], mutation.addedEvents),
      ...[].concat.apply([], mutation.removedEvents),
    );
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
