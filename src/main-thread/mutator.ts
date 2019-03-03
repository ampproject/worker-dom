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
import { TransferrableMutationType, ChildListMutationIndex } from '../transfer/replacement/TransferrableMutation';
import { EventSubscriptionProcessor } from './commands/event-subscription';
import { BoundingClientRectProcessor } from './commands/bounding-client-rect';

export class MutatorProcessor {
  private strings: Strings;
  private nodeContext: NodeContext;
  private mutationQueue: Array<ArrayBuffer>;
  private pendingMutations: boolean;
  private sanitizer: Sanitizer | undefined;
  private mutators: {
    [key: number]: (mutation: Uint16Array, target: Node) => void;
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
  mutate(nodes: ArrayBuffer, stringValues: Array<string>, mutations: ArrayBuffer): void {
    // TODO(KB): Restore signature requiring lastMutationTime. (lastGestureTime: number, mutations: TransferrableMutationRecord[])
    // if (performance.now() || Date.now() - lastGestureTime > GESTURE_TO_MUTATION_THRESHOLD) {
    //   return;
    // }
    // this.lastGestureTime = lastGestureTime;
    console.log('mutate', nodes, stringValues, mutations);
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
    this.mutationQueue.forEach(mutationBuffer => {
      const mutationArray = new Uint16Array(mutationBuffer);
      console.info('apply mutation', mutationArray);
      const target = this.nodeContext.getNode(mutationArray[1]);
      if (!target) {
        console.error(`getNode() yields null – ${target}`);
        return;
      }
      if (mutationArray[0] === TransferrableMutationType.GET_BOUNDING_CLIENT_RECT) {
        console.log('boundingClientRect');
      }
      this.mutators[mutationArray[0]](mutationArray, target);
    });
    this.mutationQueue = [];
    this.pendingMutations = false;
  };

  private mutateChildList(mutation: Uint16Array, target: HTMLElement) {
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
    if (mutation[ChildListMutationIndex.RemovedNodeCount] > 0) {
      mutation.slice(ChildListMutationIndex.Nodes + mutation[ChildListMutationIndex.AppendedNodeCount]).forEach(removeId => {
        const node = this.nodeContext.getNode(removeId);
        if (!node) {
          console.error(`getNode() yields null – ${removeId}`);
          return;
        }
        node.remove();
      });
    }
    if (mutation[ChildListMutationIndex.AppendedNodeCount] > 0) {
      mutation
        .slice(ChildListMutationIndex.Nodes, ChildListMutationIndex.Nodes + mutation[ChildListMutationIndex.AppendedNodeCount])
        .forEach(addId => {
          const newNode = this.nodeContext.getNode(addId);
          if (newNode) {
            // TODO: Handle this case ---
            // Transferred nodes that are not stored were previously removed by the sanitizer.
            target.insertBefore(newNode, (mutation[2] && this.nodeContext.getNode(mutation[2])) || null);
          }
        });
    }
  }

  private mutateAttributes(mutation: Uint16Array, target: HTMLElement | SVGElement) {
    /*
     * [
     *   TransferrableMutationType.ATTRIBUTES,
     *   Target.index,
     *   Attr.name,
     *   Attr.namespace,   // 0 the default value.
     *   Attr.value
     * ]
     */
    const attributeName = (mutation[2] !== 0 && this.strings.get(mutation[2])) || null;
    const value = (mutation[4] !== 0 && this.strings.get(mutation[4])) || null;
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
  }

  private mutateCharacterData(mutation: Uint16Array, target: CharacterData) {
    /*
     * [
     *   TransferrableMutationType.CHARACTER_DATA,
     *   Target.index,
     *   CharacterData.value
     * ]
     */
    const value = mutation[2];
    if (value) {
      // Sanitization not necessary for textContent.
      target.textContent = this.strings.get(value);
    }
  }

  private mutateProperties(mutation: Uint16Array, target: RenderableElement) {
    /*
     * [
     *   TransferrableMutationType.PROPERTIES,
     *   Target.index,
     *   Property.name,
     *   Property.value
     * ]
     */
    const name = (mutation[2] !== 0 && this.strings.get(mutation[2])) || null;
    const value = (mutation[3] !== 0 && this.strings.get(mutation[3])) || null;
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
  }
}
