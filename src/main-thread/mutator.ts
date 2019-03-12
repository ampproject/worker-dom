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

// import { TransferrableKeys } from '../transfer/TransferrableKeys';
// import { MutationRecordType } from '../worker-thread/MutationRecord';
// import { TransferrableNode } from '../transfer/TransferrableNodes';
import { NodeContext } from './nodes';
import { Strings } from './strings';
import { WorkerContext } from './worker';
import {
  TransferrableMutationType,
  ChildListMutationIndex,
  AttributeMutationIndex,
  CharacterDataMutationIndex,
  PropertyMutationIndex,
} from '../transfer/replacement/TransferrableMutation';
import { EventSubscriptionProcessor } from './commands/event-subscription';
import { BoundingClientRectProcessor } from './commands/bounding-client-rect';

export class MutatorProcessor {
  private strings: Strings;
  private nodeContext: NodeContext;
  private mutationQueue: Array<Uint16Array>;
  private pendingMutations: boolean;
  private sanitizer: Sanitizer | undefined;
  private mutators: {
    [key: number]: (mutations: Uint16Array, startPosition: number, target: Node) => number;
  };

  /**
   * @param strings
   * @param nodeContext
   * @param workerContext
   * @param passedSanitizer Sanitizer to apply to content if needed.
   */
  constructor(strings: Strings, nodeContext: NodeContext, workerContext: WorkerContext, passedSanitizer?: Sanitizer) {
    this.strings = strings;
    this.nodeContext = nodeContext;
    this.sanitizer = passedSanitizer;
    this.mutationQueue = [];
    this.pendingMutations = false;

    const eventSubscriptionProcessor = new EventSubscriptionProcessor(strings, workerContext);
    const boundingClientRectProcessor = new BoundingClientRectProcessor(workerContext);

    this.mutators = {
      [TransferrableMutationType.CHILD_LIST]: this.mutateChildList.bind(this),
      [TransferrableMutationType.ATTRIBUTES]: this.mutateAttributes.bind(this),
      [TransferrableMutationType.CHARACTER_DATA]: this.mutateCharacterData.bind(this),
      [TransferrableMutationType.PROPERTIES]: this.mutateProperties.bind(this),
      [TransferrableMutationType.EVENT_SUBSCRIPTION]: eventSubscriptionProcessor.process,
      [TransferrableMutationType.GET_BOUNDING_CLIENT_RECT]: boundingClientRectProcessor.process,
    };
  }

  /**
   * Process MutationRecords from worker thread applying changes to the existing DOM.
   * @param nodes New nodes to add in the main thread with the incoming mutations.
   * @param stringValues Additional string values to use in decoding messages.
   * @param mutations Changes to apply in both graph shape and content of Elements.
   */
  mutate(nodes: ArrayBuffer, stringValues: Array<string>, mutations: Uint16Array): void {
    // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferrableMutationRecord[])
    // if (performance.now() || Date.now() - lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
    //   return;
    // }
    // this.lastGestureTime = lastGestureTime;
    // console.log('mutate', nodes, stringValues, mutations);
    this.strings.storeValues(stringValues);
    this.nodeContext.createNodes(nodes, this.sanitizer);
    this.mutationQueue = this.mutationQueue.concat(mutations);
    if (!this.pendingMutations) {
      this.pendingMutations = true;
      requestAnimationFrame(this.syncFlush);
    }
  }

  /**
   * Apply all stored mutations syncronously. This method works well, but can cause jank if there are too many
   * mutations to apply in a single frame.
   *
   * Investigations in using asyncFlush to resolve are worth considering.
   */
  private syncFlush = (): void => {
    this.mutationQueue.forEach(mutationArray => {
      let operationStart: number = 0;
      let length: number = mutationArray.length;

      while (operationStart < length) {
        const target = this.nodeContext.getNode(mutationArray[operationStart + 1]);
        if (!target) {
          console.error(`getNode() yields null – ${target}`);
          return;
        }
        operationStart = this.mutators[mutationArray[operationStart]](mutationArray, operationStart, target);
      }
    });
    this.mutationQueue = [];
    this.pendingMutations = false;
  };

  private mutateChildList(mutations: Uint16Array, startPosition: number, target: HTMLElement): number {
    /**
     * [
     *   TransferrableMutationType.CHILD_LIST,
     *   Target.index,
     *   NextSibling.index,
     *   PreviousSibling.index,
     *   AppendedNodeCount,
     *   RemovedNodeCount,
     *   ... AppendedNode.index,
     *   ... RemovedNode.index,
     * ]
     */
    const appendNodeCount = mutations[startPosition + ChildListMutationIndex.AppendedNodeCount];
    const removeNodeCount = mutations[startPosition + ChildListMutationIndex.RemovedNodeCount];
    if (removeNodeCount > 0) {
      mutations
        .slice(
          startPosition + ChildListMutationIndex.Nodes + appendNodeCount,
          startPosition + ChildListMutationIndex.Nodes + appendNodeCount + removeNodeCount,
        )
        .forEach(removeId => {
          const node = this.nodeContext.getNode(removeId);
          if (!node) {
            console.error(`getNode() yields null – ${removeId}`);
            return;
          }
          node.remove();
        });
    }
    if (appendNodeCount > 0) {
      mutations.slice(startPosition + ChildListMutationIndex.Nodes, startPosition + ChildListMutationIndex.Nodes + appendNodeCount).forEach(addId => {
        const nextSibling = mutations[startPosition + ChildListMutationIndex.NextSibling];
        const newNode = this.nodeContext.getNode(addId);
        if (newNode) {
          // TODO: Handle this case ---
          // Transferred nodes that are not stored were previously removed by the sanitizer.
          target.insertBefore(newNode, (nextSibling && this.nodeContext.getNode(nextSibling)) || null);
        }
      });
    }
    return startPosition + ChildListMutationIndex.LastStaticNode + appendNodeCount + removeNodeCount + 1;
  }

  private mutateAttributes(mutations: Uint16Array, startPosition: number, target: HTMLElement | SVGElement): number {
    /*
     * [
     *   TransferrableMutationType.ATTRIBUTES,
     *   Target.index,
     *   Attr.name,
     *   Attr.namespace,   // 0 the default value.
     *   Attr.value
     * ]
     */
    const attributeName =
      (mutations[startPosition + AttributeMutationIndex.Name] !== 0 && this.strings.get(mutations[startPosition + AttributeMutationIndex.Name])) ||
      null;
    const value =
      (mutations[startPosition + AttributeMutationIndex.Value] !== 0 && this.strings.get(mutations[startPosition + AttributeMutationIndex.Value])) ||
      null;
    if (attributeName != null) {
      if (value == null) {
        target.removeAttribute(attributeName);
      } else {
        if (!this.sanitizer || this.sanitizer.validAttribute(target.nodeName, attributeName, value)) {
          target.setAttribute(attributeName, value);
        } else {
          // TODO(choumx): Inform worker that sanitizer ignored unsafe attribute value change.
        }
      }
    }
    return startPosition + AttributeMutationIndex.LastStaticNode + 1;
  }

  private mutateCharacterData(mutations: Uint16Array, startPosition: number, target: CharacterData): number {
    /*
     * [
     *   TransferrableMutationType.CHARACTER_DATA,
     *   Target.index,
     *   CharacterData.value
     * ]
     */
    const value = mutations[startPosition + CharacterDataMutationIndex.Value];
    if (value) {
      // Sanitization not necessary for textContent.
      target.textContent = this.strings.get(value);
    }
    return startPosition + CharacterDataMutationIndex.LastStaticNode + 1;
  }

  private mutateProperties(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
    /*
     * [
     *   TransferrableMutationType.PROPERTIES,
     *   Target.index,
     *   Property.name,
     *   Property.value
     * ]
     */
    const name =
      (mutations[startPosition + PropertyMutationIndex.Name] !== 0 && this.strings.get(mutations[startPosition + PropertyMutationIndex.Name])) ||
      null;
    const value =
      (mutations[startPosition + PropertyMutationIndex.Value] !== 0 && this.strings.get(mutations[startPosition + PropertyMutationIndex.Value])) ||
      null;
    if (name && value != null) {
      const stringValue = String(value);
      if (!this.sanitizer || this.sanitizer.validProperty(target.nodeName, name, stringValue)) {
        // TODO(choumx, #122): Proper support for non-string property mutations.
        const isBooleanProperty = name == 'checked';
        target[name] = isBooleanProperty ? value === 'true' : value;
      } else {
        // TODO(choumx): Inform worker that sanitizer ignored unsafe property value change.
      }
    }
    return startPosition + PropertyMutationIndex.LastStaticNode + 1;
  }
}
