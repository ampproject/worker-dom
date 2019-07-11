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
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { EVENT_SUBSCRIPTION_LENGTH, EventSubscriptionMutationIndex, TransferrableTouchList } from '../../transfer/TransferrableEvent';
import { WorkerContext } from '../worker';
import { CommandExecutorInterface } from './interface';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

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
 * Tell WorkerDOM what the value is for a Node.
 * @param worker whom to dispatch value toward.
 * @param node where to get the value from.
 */
const fireValueChange = (workerContext: WorkerContext, node: RenderableElement): void =>
  workerContext.messageToWorker({
    [TransferrableKeys.type]: MessageType.SYNC,
    [TransferrableKeys.sync]: {
      [TransferrableKeys.index]: node._index_,
      [TransferrableKeys.value]: node.value,
    },
  });

/**
 * Tell WorkerDOM what the window dimensions are.
 * @param workerContext
 * @param cachedWindowSize
 */
const fireResizeChange = (workerContext: WorkerContext, cachedWindowSize: [number, number]): void =>
  workerContext.messageToWorker({
    [TransferrableKeys.type]: MessageType.RESIZE,
    [TransferrableKeys.sync]: cachedWindowSize,
  });

/**
 * Convert a TouchList into a TransferrableTouchList
 * @param touchList
 */
const createTransferrableTouchList = (touchList: TouchList): TransferrableTouchList =>
  Object.values(touchList).map(touch => [
    touch.identifier,
    touch.screenX,
    touch.screenY,
    touch.clientX,
    touch.clientY,
    touch.pageX,
    touch.pageY,
    (touch.target as RenderableElement)._index_,
  ]);

export const EventSubscriptionProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const knownListeners: Array<(event: Event) => any> = [];
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.EVENT_SUBSCRIPTION);
  let cachedWindowSize: [number, number] = [window.innerWidth, window.innerHeight];

  /**
   * Register an event handler for dispatching events to worker thread
   * @param worker whom to dispatch events toward
   * @param index node index the event comes from (used to dispatchEvent in worker thread).
   * @return eventHandler function consuming event and dispatching to worker thread
   */
  const eventHandler = (index: number) => (event: Event | KeyboardEvent | MouseEvent | TouchEvent): void => {
    if (shouldTrackChanges(event.currentTarget as HTMLElement)) {
      fireValueChange(workerContext, event.currentTarget as RenderableElement);
    } else if (event.type === 'resize') {
      const { innerWidth, innerHeight } = window;
      if (cachedWindowSize[0] === innerWidth && cachedWindowSize[1] === innerHeight) {
        return;
      }
      cachedWindowSize = [window.innerWidth, window.innerHeight];
      fireResizeChange(workerContext, cachedWindowSize);
    }

    workerContext.messageToWorker({
      [TransferrableKeys.type]: MessageType.EVENT,
      [TransferrableKeys.event]: {
        [TransferrableKeys.index]: index,
        [TransferrableKeys.bubbles]: event.bubbles,
        [TransferrableKeys.cancelable]: event.cancelable,
        [TransferrableKeys.cancelBubble]: event.cancelBubble,
        [TransferrableKeys.currentTarget]: [(event.currentTarget as RenderableElement)._index_ || 0],
        [TransferrableKeys.defaultPrevented]: event.defaultPrevented,
        [TransferrableKeys.eventPhase]: event.eventPhase,
        [TransferrableKeys.isTrusted]: event.isTrusted,
        [TransferrableKeys.returnValue]: event.returnValue,
        [TransferrableKeys.target]: [(event.target as RenderableElement)._index_ || 0],
        [TransferrableKeys.timeStamp]: event.timeStamp,
        [TransferrableKeys.type]: event.type,
        [TransferrableKeys.keyCode]: 'keyCode' in event ? event.keyCode : undefined,
        [TransferrableKeys.pageX]: 'pageX' in event ? event.pageX : undefined,
        [TransferrableKeys.pageY]: 'pageY' in event ? event.pageY : undefined,
        [TransferrableKeys.offsetX]: 'offsetX' in event ? event.offsetX : undefined,
        [TransferrableKeys.offsetY]: 'offsetY' in event ? event.offsetY : undefined,
        [TransferrableKeys.touches]: 'touches' in event ? createTransferrableTouchList(event.touches) : undefined,
        [TransferrableKeys.changedTouches]: 'changedTouches' in event ? createTransferrableTouchList(event.changedTouches) : undefined,
      },
    });
  };

  /**
   * If the worker requests to add an event listener to 'change' for something the foreground thread is already listening to,
   * ensure that only a single 'change' event is attached to prevent sending values multiple times.
   * @param target node to change listeners on
   * @param addEvent is this an 'addEvent' or 'removeEvent' change
   * @param type event type requested to change
   * @param index number in the listeners array this event corresponds to.
   */
  const processListenerChange = (target: RenderableElement, addEvent: boolean, type: string, index: number): void => {
    let changeEventSubscribed: boolean = target.onchange !== null;
    const shouldTrack: boolean = shouldTrackChanges(target as HTMLElement);
    const isChangeEvent = type === 'change';
    const isResizeEvent = type === 'resize';

    if (addEvent) {
      if (isResizeEvent && target === nodeContext.baseElement) {
        addEventListener(type, (knownListeners[index] = eventHandler(1)));
        return;
      }

      if (isChangeEvent) {
        changeEventSubscribed = true;
        target.onchange = null;
      }
      (target as HTMLElement).addEventListener(type, (knownListeners[index] = eventHandler(target._index_)));
    } else {
      if (isResizeEvent && target === nodeContext.baseElement) {
        removeEventListener(type, knownListeners[index]);
        return;
      }

      if (isChangeEvent) {
        changeEventSubscribed = false;
      }
      (target as HTMLElement).removeEventListener(type, knownListeners[index]);
    }
    if (shouldTrack && !changeEventSubscribed) {
      applyDefaultChangeListener(workerContext, target as RenderableElement);
    }
  };

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      const addEventListenerCount = mutations[startPosition + EventSubscriptionMutationIndex.AddEventListenerCount];
      const removeEventListenerCount = mutations[startPosition + EventSubscriptionMutationIndex.RemoveEventListenerCount];
      const addEventListenersPosition = startPosition + EventSubscriptionMutationIndex.Events + removeEventListenerCount * EVENT_SUBSCRIPTION_LENGTH;
      const endPosition =
        startPosition + EventSubscriptionMutationIndex.Events + (addEventListenerCount + removeEventListenerCount) * EVENT_SUBSCRIPTION_LENGTH;

      if (allowedExecution) {
        const targetIndex = mutations[startPosition + EventSubscriptionMutationIndex.Target];
        const target = nodeContext.getNode(targetIndex);

        if (target) {
          for (let iterator = startPosition + EventSubscriptionMutationIndex.Events; iterator < endPosition; iterator += EVENT_SUBSCRIPTION_LENGTH) {
            processListenerChange(target, iterator <= addEventListenersPosition, strings.get(mutations[iterator]), mutations[iterator + 1]);
          }
        } else {
          console.error(`getNode(${targetIndex}) is null.`);
        }
      }

      return endPosition;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      const addEventListenerCount = mutations[startPosition + EventSubscriptionMutationIndex.AddEventListenerCount];
      const removeEventListenerCount = mutations[startPosition + EventSubscriptionMutationIndex.RemoveEventListenerCount];
      const addEventListenersPosition = startPosition + EventSubscriptionMutationIndex.Events + removeEventListenerCount * EVENT_SUBSCRIPTION_LENGTH;
      const endPosition =
        startPosition + EventSubscriptionMutationIndex.Events + (addEventListenerCount + removeEventListenerCount) * EVENT_SUBSCRIPTION_LENGTH;

      let removedEventListeners: Array<{ type: string; index: number }> = [];
      let addedEventListeners: Array<{ type: string; index: number }> = [];

      for (let iterator = startPosition + EventSubscriptionMutationIndex.Events; iterator < endPosition; iterator += EVENT_SUBSCRIPTION_LENGTH) {
        const eventList = iterator <= addEventListenersPosition ? addedEventListeners : removedEventListeners;
        eventList.push({
          type: strings.get(mutations[iterator]),
          index: mutations[iterator + 1],
        });
      }

      return {
        target,
        allowedExecution,
        removedEventListeners,
        addedEventListeners,
      };
    },
  };
};
