import { MessageType } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import {
  ADD_EVENT_SUBSCRIPTION_LENGTH,
  REMOVE_EVENT_SUBSCRIPTION_LENGTH,
  EventSubscriptionMutationIndex,
  TransferrableTouchList,
  AddEventRegistrationIndex,
} from '../../transfer/TransferrableEvent';
import { WorkerContext } from '../worker';
import { CommandExecutorInterface } from './interface';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { BASE_ELEMENT_INDEX } from '../nodes';

/**
 * Monitoring Nodes attribute changes requires a Mutation Observer.
 * We store the nodes being monitored to avoid creating more than one Observer
 * per Element.
 */
const monitoredNodes: Map<RenderableElement, boolean> = new Map();

/**
 * Instead of a whitelist of elements that need their value tracked, use the existence
 * of a property called value to drive the decision.
 * @param node node to check if values should be tracked.
 * @return boolean if the node should have its value property tracked.
 */
const shouldTrackChanges = (node: HTMLElement): boolean => node && 'value' in node;

/**
 * When a node that has a value needing synced doesn't already have an event listener
 * listening for input values, ensure the value is synced with a default listener.
 * @param worker whom to dispatch value toward.
 * @param node node to listen to value changes on.
 */
export const applyDefaultInputListener = (workerContext: WorkerContext, node: RenderableElement): void => {
  if (shouldTrackChanges(node as HTMLElement) && node.oninput === null) {
    node.oninput = () => fireValueChange(workerContext, node);
  }
};

/**
 * Use a MutationObserver to capture value changes based on Attribute modification (frequently used by frameworks).
 * @param worker whom to dispatch value toward.
 * @param node node to listen to value changes on.
 */
export const sendValueChangeOnAttributeMutation = (workerContext: WorkerContext, node: RenderableElement): void => {
  if (shouldTrackChanges(node as HTMLElement) && !monitoredNodes.get(node)) {
    new MutationObserver((mutations: Array<MutationRecord>) =>
      mutations.map((mutation) => fireValueChange(workerContext, mutation.target as RenderableElement)),
    ).observe(node, { attributes: true });
    monitoredNodes.set(node, true);
  }
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
  Object.values(touchList).map((touch) => [
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
  const eventHandler =
    (index: number, preventDefault: boolean) =>
    (event: Event | KeyboardEvent | MouseEvent | TouchEvent): void => {
      if (preventDefault) {
        event.preventDefault();
      }

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
   * @param mutations Uint16Array for this set of changes
   * @param iterator current location in array to perform this change on
   */
  const processListenerChange = (target: RenderableElement, addEvent: boolean, mutations: Uint16Array, iterator: number): void => {
    const type = strings.get(mutations[iterator]);
    const eventIndex = mutations[iterator + AddEventRegistrationIndex.Index];

    if (target === nodeContext.baseElement) {
      if (addEvent) {
        const preventDefault = Boolean(mutations[iterator + AddEventRegistrationIndex.WorkerDOMPreventDefault]);
        addEventListener(type, (knownListeners[eventIndex] = eventHandler(BASE_ELEMENT_INDEX, preventDefault)));
      } else {
        removeEventListener(type, knownListeners[eventIndex]);
      }
      return;
    }

    let inputEventSubscribed: boolean = target.oninput !== null;
    const isChangeEvent = type === 'change';
    if (addEvent) {
      if (isChangeEvent) {
        inputEventSubscribed = true;
        target.onchange = null;
      }
      const preventDefault = Boolean(mutations[iterator + AddEventRegistrationIndex.WorkerDOMPreventDefault]);
      (target as HTMLElement).addEventListener(type, (knownListeners[eventIndex] = eventHandler(target._index_, preventDefault)));
    } else {
      if (isChangeEvent) {
        inputEventSubscribed = false;
      }
      (target as HTMLElement).removeEventListener(type, knownListeners[eventIndex]);
    }
    if (shouldTrackChanges(target as HTMLElement)) {
      if (!inputEventSubscribed) applyDefaultInputListener(workerContext, target as RenderableElement);
      sendValueChangeOnAttributeMutation(workerContext, target as RenderableElement);
    }
  };

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      const addEventListenerCount = mutations[startPosition + EventSubscriptionMutationIndex.AddEventListenerCount];
      const removeEventListenerCount = mutations[startPosition + EventSubscriptionMutationIndex.RemoveEventListenerCount];
      const addEventListenersPosition =
        startPosition + EventSubscriptionMutationIndex.Events + removeEventListenerCount * REMOVE_EVENT_SUBSCRIPTION_LENGTH;
      const endPosition =
        startPosition +
        EventSubscriptionMutationIndex.Events +
        addEventListenerCount * ADD_EVENT_SUBSCRIPTION_LENGTH +
        removeEventListenerCount * REMOVE_EVENT_SUBSCRIPTION_LENGTH;

      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + EventSubscriptionMutationIndex.Target];
        const target = nodeContext.getNode(targetIndex);

        if (target) {
          let iterator = startPosition + EventSubscriptionMutationIndex.Events;
          while (iterator < endPosition) {
            const isRemoveEvent = iterator <= addEventListenersPosition;
            processListenerChange(target, isRemoveEvent, mutations, iterator);
            iterator += isRemoveEvent ? REMOVE_EVENT_SUBSCRIPTION_LENGTH : ADD_EVENT_SUBSCRIPTION_LENGTH;
          }
        } else {
          console.error(`getNode(${targetIndex}) is null.`);
        }
      }

      return endPosition;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const addEventListenerCount = mutations[startPosition + EventSubscriptionMutationIndex.AddEventListenerCount];
      const removeEventListenerCount = mutations[startPosition + EventSubscriptionMutationIndex.RemoveEventListenerCount];
      const addEventListenersPosition =
        startPosition + EventSubscriptionMutationIndex.Events + removeEventListenerCount * REMOVE_EVENT_SUBSCRIPTION_LENGTH;
      const endPosition =
        startPosition +
        EventSubscriptionMutationIndex.Events +
        addEventListenerCount * ADD_EVENT_SUBSCRIPTION_LENGTH +
        removeEventListenerCount * REMOVE_EVENT_SUBSCRIPTION_LENGTH;
      const targetIndex = mutations[startPosition + EventSubscriptionMutationIndex.Target];
      const target = nodeContext.getNode(targetIndex);
      const removedEventListeners: Array<{ type: string; index: number }> = [];
      const addedEventListeners: Array<{ type: string; index: number }> = [];

      let iterator = startPosition + EventSubscriptionMutationIndex.Events;
      while (iterator < endPosition) {
        const isRemoveEvent = iterator <= addEventListenersPosition;
        const eventList = isRemoveEvent ? addedEventListeners : removedEventListeners;
        eventList.push({
          type: strings.get(mutations[iterator]),
          index: mutations[iterator + 1],
        });
        iterator += isRemoveEvent ? REMOVE_EVENT_SUBSCRIPTION_LENGTH : ADD_EVENT_SUBSCRIPTION_LENGTH;
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
