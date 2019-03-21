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

import { MessageType } from '../../transfer/Messages';
import { NumericBoolean } from '../../utils';
import { NodeContext } from '../nodes';
import { Strings } from '../strings';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationRecord } from '../../transfer/TransferrableRecord';
import { WorkerContext } from '../worker';

export class EventSubscriptionProcessor {
  private strings: Strings;
  private nodeContext: NodeContext;
  private workerContext: WorkerContext;
  // TODO(choumx): Support SYNC events for properties other than 'value', e.g. 'checked'.
  private knownListeners: Array<(event: Event) => any>;

  constructor(strings: Strings, nodeContext: NodeContext, workerContext: WorkerContext) {
    this.strings = strings;
    this.nodeContext = nodeContext;
    this.workerContext = workerContext;
    this.knownListeners = [];
  }

  /**
   * Process event subscription changes transfered from worker thread to main thread.
   * @param mutation mutation record containing commands to execute.
   */
  process(mutation: TransferrableMutationRecord): void {
    const nodeId = mutation[TransferrableKeys.target];
    const target = this.nodeContext.getNode(nodeId);

    if (!target) {
      console.error('getNode() yields a null value. Node id (' + nodeId + ') was not found.');
      return;
    }

    (mutation[TransferrableKeys.removedEvents] || []).forEach(eventSub =>
      this.processListenerChange(target, false, this.strings.get(eventSub[TransferrableKeys.type]), eventSub[TransferrableKeys.index]),
    );
    (mutation[TransferrableKeys.addedEvents] || []).forEach(eventSub =>
      this.processListenerChange(target, true, this.strings.get(eventSub[TransferrableKeys.type]), eventSub[TransferrableKeys.index]),
    );
  }

  /**
   * If the worker requests to add an event listener to 'change' for something the foreground thread is already listening to,
   * ensure that only a single 'change' event is attached to prevent sending values multiple times.
   * @param target node to change listeners on
   * @param addEvent is this an 'addEvent' or 'removeEvent' change
   * @param type event type requested to change
   * @param index number in the listeners array this event corresponds to.
   */
  private processListenerChange(target: RenderableElement, addEvent: boolean, type: string, index: number): void {
    let changeEventSubscribed: boolean = target.onchange !== null;
    const shouldTrack: boolean = shouldTrackChanges(target as HTMLElement);
    const isChangeEvent = type === 'change';

    if (addEvent) {
      if (isChangeEvent) {
        changeEventSubscribed = true;
        target.onchange = null;
      }
      (target as HTMLElement).addEventListener(type, (this.knownListeners[index] = eventHandler(this.workerContext, target._index_)));
    } else {
      if (isChangeEvent) {
        changeEventSubscribed = false;
      }
      (target as HTMLElement).removeEventListener(type, this.knownListeners[index]);
    }
    if (shouldTrack && !changeEventSubscribed) {
      applyDefaultChangeListener(this.workerContext, target as RenderableElement);
    }
  }
}

/**
 * Instead of a whitelist of elements that need their value tracked, use the existence
 * of a property called value to drive the decision.
 * @param node node to check if values should be tracked.
 * @return boolean if the node should have its value property tracked.
 */
const shouldTrackChanges = (node: HTMLElement): boolean => node && 'value' in node;

/**
 * When a node that has a value needing synced doesn't already have an event listener
 * listening for changed values, ensure the value is synced with a default listener.
 * @param worker whom to dispatch value toward.
 * @param node node to listen to value changes on.
 */
const applyDefaultChangeListener = (workerContext: WorkerContext, node: RenderableElement): void => {
  shouldTrackChanges(node as HTMLElement) && node.onchange === null && (node.onchange = () => fireValueChange(workerContext, node));
};

/**
 * Tell the worker DOM what the value is for a Node.
 * @param worker whom to dispatch value toward.
 * @param node where to get the value from.
 */
const fireValueChange = (workerContext: WorkerContext, node: RenderableElement): void => {
  workerContext.messageToWorker({
    [TransferrableKeys.type]: MessageType.SYNC,
    [TransferrableKeys.sync]: {
      [TransferrableKeys.index]: node._index_,
      [TransferrableKeys.value]: node.value,
    },
  }, []);
};

/**
 * Register an event handler for dispatching events to worker thread
 * @param worker whom to dispatch events toward
 * @param index node index the event comes from (used to dispatchEvent in worker thread).
 * @return eventHandler function consuming event and dispatching to worker thread
 */
const eventHandler = (workerContext: WorkerContext, index: number) => (event: Event | KeyboardEvent): void => {
  if (shouldTrackChanges(event.currentTarget as HTMLElement)) {
    fireValueChange(workerContext, event.currentTarget as RenderableElement);
  }
  workerContext.messageToWorker({
    [TransferrableKeys.type]: MessageType.EVENT,
    [TransferrableKeys.event]: {
      [TransferrableKeys.index]: index,
      [TransferrableKeys.bubbles]: event.bubbles,
      [TransferrableKeys.cancelable]: event.cancelable,
      [TransferrableKeys.cancelBubble]: event.cancelBubble,
      [TransferrableKeys.currentTarget]: {
        [TransferrableKeys.index]: (event.currentTarget as RenderableElement)._index_,
        [TransferrableKeys.transferred]: NumericBoolean.TRUE,
      },
      [TransferrableKeys.defaultPrevented]: event.defaultPrevented,
      [TransferrableKeys.eventPhase]: event.eventPhase,
      [TransferrableKeys.isTrusted]: event.isTrusted,
      [TransferrableKeys.returnValue]: event.returnValue,
      [TransferrableKeys.target]: {
        [TransferrableKeys.index]: (event.target as RenderableElement)._index_,
        [TransferrableKeys.transferred]: NumericBoolean.TRUE,
      },
      [TransferrableKeys.timeStamp]: event.timeStamp,
      [TransferrableKeys.type]: event.type,
      [TransferrableKeys.keyCode]: 'keyCode' in event ? event.keyCode : undefined,
    },
  }, []);
};
