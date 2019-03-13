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

// import { Node } from '../worker-thread/dom/Node';
import { Document } from '../worker-thread/dom/Document';
import { MutationRecord } from '../worker-thread/MutationRecord';
// import { TransferrableMutationRecords } from './TransferrableRecord';
// import { TransferrableNode } from './replacement/TransferrableNodes';
// import { MessageType, MutationFromWorker } from './Messages';
// import { TransferrableKeys } from './TransferrableKeys';
// import { consume as consumeNodes } from '../worker-thread/nodes';
// import { store as storeString, consume as consumeStrings } from '../worker-thread/strings';
import { set as setPhase, Phases } from '../transfer/phase'; // phase,
// import { NumericBoolean } from '../utils';
// import { BYTES_PER_ELEMENT } from './TypedArrayHelpers';
// import { TransferrableEventSubscriptionChange } from './TransferrableEvent';

let observing = false;

// const stringHelper = (value?: string | null): number => (value ? storeString(value) : 0);
/**
 *
 * @param mutations
 */
// function serializeMutations(mutations: MutationRecord[]): MutationFromWorker {
//   const nodes: Array<TransferrableNode> = consumeNodes().map(node => node[TransferrableKeys.creationFormat]);
//   const serializeNodes = (nodes: Array<Node>): void => nodes.forEach(node => view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), node[TransferrableKeys.index]));
//   const type = phase === Phases.Mutating ? MessageType.MUTATE : MessageType.HYDRATE;
//   // let transferrableMutations: TransferrableMutationRecords = [];
//   const buffer: ArrayBuffer = new ArrayBuffer(256);
//   const view: DataView = new DataView(buffer);
//   let byteOffset: number = 0;

//   /* Structure
//   [
//     UInt8,  // MutationRecordType
//     UInt16, // MutationRecordTarget (Identifier)
//     UInt8,  // AddedNodeCount
//     UInt8,  // RemovedNodeCount
//     UInt8,  // AddedEventCount
//     UInt8,  // RemovedEventCount
//     UInt16, // PreviousSibling (Identifier, 0 = not used)
//     UInt16, // NextSibling (Identifier, 0 = not used)
//     UInt16, // AttributeName (Identifier, 0 = not used)
//     UInt16, // AttributeNamespace (Identifier, 0 = not used)
//     UInt16, // PropertyName (Identifier, 0 = not used)
//     UInt16, // NewValue (Identifer, 0 = not used)
//     UInt16, // OldValue (Identifer, 0 = not used)

//     // AddedNode Identifiers
//     ...Array<UInt16>.length(AddedNodeCount)

//     // RemovedNode Identifers
//     ...Array<UInt16>.length(RemovedNodeCount)

//     // AddedEvents
//     ...(Array<UInt16, UInt16, UInt16>).length(AddedEventCount)

//     // RemovedEvents
//     ...(Array<UInt16, UInt16, UInt16>).length(AddedEventCount)
//   ]
//   */

//   console.log('serialize mutations', mutations);

//   const serializeEventSubscriptions = (addedEvents: Array<TransferrableEventSubscriptionChange>, removedEvents: Array<TransferrableEventSubscriptionChange>): void => {
//     addedEvents.concat(removedEvents).forEach(event => {
//       view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), event[0]);
//       view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), event[1]);
//       view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), event[2]);
//     });
//   };
//   mutations.forEach(mutation => {
//     const addedNodes = mutation.addedNodes || [];
//     const removedNodes = mutation.removedNodes || [];
//     const addedEvents = mutation.addedEvents || [];
//     const removedEvents = mutation.removedEvents || [];

//     view.setUint8(byteOffset, mutation.type);
//     view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT8), mutation.target[TransferrableKeys.index]);
//     view.setUint8((byteOffset += BYTES_PER_ELEMENT.UINT16), addedNodes.length);
//     view.setUint8((byteOffset += BYTES_PER_ELEMENT.UINT8), removedNodes.length);
//     view.setUint8((byteOffset += BYTES_PER_ELEMENT.UINT8), addedEvents.length);
//     view.setUint8((byteOffset += BYTES_PER_ELEMENT.UINT8), removedEvents.length);
//     view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT8), mutation.previousSibling ? mutation.previousSibling[0] : 0);
//     view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), mutation.nextSibling ? mutation.nextSibling[0] : 0);
//     view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), stringHelper(mutation.attributeName));
//     view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), stringHelper(mutation.attributeNamespace));
//     view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), stringHelper(mutation.propertyName));
//     view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), stringHelper(mutation.value));
//     view.setUint16((byteOffset += BYTES_PER_ELEMENT.UINT16), stringHelper(mutation.oldValue));
//     serializeNodes(addedNodes);
//     serializeNodes(removedNodes);
//     serializeEventSubscriptions(addedEvents, removedEvents);

//     // addedNodes.forEach(addedNode => view.setUint16((byteOffset += SizeInBytes.UINT16), addedNode[TransferrableKeys.index]));
//     // removedNodes.forEach(removedNode => view.setUint16((byteOffset += SizeInBytes.UINT16), removedNode[TransferrableKeys.index]));

//     // view.setInt.push(
//     //   mutation.type,
//     //   mutation.target[TransferrableKeys.index],
//     //   (mutation.addedNodes || []).length,
//     //   (mutation.removedNodes || []).length,
//     //   (mutation.addedEvents || []).length,
//     //   (mutation.removedEvents || []).length,
//     //   numericBooleanHelper(mutation.previousSibling),
//     //   transferrableNodeHelper(mutation.previousSibling),
//     //   numericBooleanHelper(mutation.nextSibling),
//     //   transferrableNodeHelper(mutation.nextSibling),

//     //   numericBooleanHelper(mutation.attributeName),
//     //   transferrableStringHelper(mutation.attributeName),
//     //   numericBooleanHelper(mutation.attributeNamespace),
//     //   transferrableStringHelper(mutation.attributeNamespace),
//     //   numericBooleanHelper(mutation.propertyName),
//     //   transferrableStringHelper(mutation.propertyName),
//     //   transferrableStringHelper(mutation.value),
//     //   transferrableStringHelper(mutation.oldValue),

//     //   ...serializeNodes(mutation.addedNodes || []),
//     //   ...serializeNodes(mutation.removedNodes || []),
//     //   ...[].concat.apply([], mutation.addedEvents),
//     //   ...[].concat.apply([], mutation.removedEvents),
//     // );
//   });
//   return {
//     [TransferrableKeys.type]: type,
//     [TransferrableKeys.strings]: consumeStrings(),
//     [TransferrableKeys.nodes]: nodes,
//     [TransferrableKeys.mutations]: buffer,
//   };
// }

/**
 *
 * @param incoming
 * @param postMessage
 */
function handleMutations(incoming: Array<MutationRecord>, postMessage?: Function): void {
  if (postMessage) {
    // const transferrableMutations = serializeMutations(incoming);
    // postMessage(transferrableMutations, [transferrableMutations[TransferrableKeys.mutations]]);
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
