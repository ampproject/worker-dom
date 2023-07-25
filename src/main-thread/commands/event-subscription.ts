import { MessageType } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import {
  EventSubscriptionMutationIndex,
  TransferrableEvent,
  TransferrableTouchList,
} from '../../transfer/TransferrableEvent';
import { WorkerContext } from '../worker';
import { CommandExecutorInterface } from './interface';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { StringContext } from '../strings';

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
  workerContext.messageToWorker(
    {
      [TransferrableKeys.type]: MessageType.SYNC,
      [TransferrableKeys.sync]: {
        [TransferrableKeys.index]: node._index_,
        [TransferrableKeys.value]: node.value,
      },
    },
    [],
  );

/**
 * Tell WorkerDOM what the window dimensions are.
 * @param workerContext
 * @param cachedWindowSize
 */
const fireResizeChange = (workerContext: WorkerContext, cachedWindowSize: [number, number]): void =>
  workerContext.messageToWorker(
    {
      [TransferrableKeys.type]: MessageType.RESIZE,
      [TransferrableKeys.sync]: cachedWindowSize,
    },
    [],
  );

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
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.EVENT_SUBSCRIPTION);
  let cachedWindowSize: [number, number] = [window.innerWidth, window.innerHeight];

  /**
   * Register an event handler for dispatching events to worker thread
   * @param worker whom to dispatch events toward
   * @param index node index the event comes from (used to dispatchEvent in worker thread).
   * @return eventHandler function consuming event and dispatching to worker thread
   */
  const eventHandler =
    (target: RenderableElement, preventDefault: boolean) =>
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

      workerContext.messageToWorker(
        {
          [TransferrableKeys.type]: MessageType.EVENT,
          [TransferrableKeys.event]: buildEventMessage(target, event, strings),
        },
        [],
      );
    };

  /**
   * If the worker requests to add an event listener to 'change' for something the foreground thread is already listening to,
   * ensure that only a single 'change' event is attached to prevent sending values multiple times.
   * @param target node to change listeners on
   * @param type event type
   * @param addEvent is this an 'addEvent' or 'removeEvent' change
   * @param preventDefault prevent default flag, use only if addEvent is true
   */
  const processListenerChange = (target: RenderableElement, type: string, addEvent: boolean, preventDefault: boolean): void => {
    target._knownListeners_ = target._knownListeners_ || ({} as { [key: string]: (event: Event) => any });

    if (target === nodeContext.baseElement) {
      if (addEvent) {
        if (target._knownListeners_[type]) {
          removeEventListener(type, target._knownListeners_[type]);
        }
        addEventListener(type, (target._knownListeners_[type] = eventHandler(target, preventDefault)));
      } else {
        removeEventListener(type, target._knownListeners_[type]);
        delete target._knownListeners_[type];
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
      if (target._knownListeners_[type]) {
        (target as EventTarget).removeEventListener(type, target._knownListeners_[type]);
      }
      (target as EventTarget).addEventListener(type, (target._knownListeners_[type] = eventHandler(target, preventDefault)));
    } else {
      if (isChangeEvent) {
        inputEventSubscribed = false;
      }
      (target as EventTarget).removeEventListener(type, target._knownListeners_[type]);
      delete target._knownListeners_[type];
    }
    if (shouldTrackChanges(target as HTMLElement)) {
      if (!inputEventSubscribed) applyDefaultInputListener(workerContext, target as RenderableElement);
      sendValueChangeOnAttributeMutation(workerContext, target as RenderableElement);
    }
  };

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation) {
        const target = mutations[EventSubscriptionMutationIndex.Target];

        if (target) {
          const type = mutations[EventSubscriptionMutationIndex.EventType];
          const addEvent = mutations[EventSubscriptionMutationIndex.IsAddEvent];
          const preventDefault = addEvent ? mutations[EventSubscriptionMutationIndex.PreventDefault] : false;

          processListenerChange(target, type, addEvent, preventDefault);
        } else {
          console.error(`target is null.`);
        }
      }
    },
    print(mutations: any[]): {} {
      const target = mutations[EventSubscriptionMutationIndex.Target];
      const type = mutations[EventSubscriptionMutationIndex.EventType];
      const addEvent = mutations[EventSubscriptionMutationIndex.IsAddEvent];
      const preventDefault = addEvent ? mutations[EventSubscriptionMutationIndex.PreventDefault] : false;

      return {
        target,
        allowedExecution,
        type,
        addEvent,
        preventDefault,
      };
    },
  };
};

function buildEventMessage(target: RenderableElement, event: Event | KeyboardEvent | MouseEvent | TouchEvent, strings: StringContext) {
  const msg: any = {
    [TransferrableKeys.index]: target._index_,
    [TransferrableKeys.nodeType]: target instanceof Node ? TransferrableObjectType.HTMLElement : TransferrableObjectType.TransferObject,
    [TransferrableKeys.type]: event.type,
    [TransferrableKeys.timeStamp]: event.timeStamp,
    [TransferrableKeys.eventPhase]: event.eventPhase,
  };

  if (event.bubbles) {
    msg[TransferrableKeys.bubbles] = event.bubbles;
  }

  if (event.cancelable) {
    msg[TransferrableKeys.cancelable] = event.cancelable;
  }

  if (event.cancelBubble) {
    msg[TransferrableKeys.cancelBubble] = event.cancelBubble;
  }

  if (event.defaultPrevented) {
    msg[TransferrableKeys.defaultPrevented] = event.defaultPrevented;
  }
  if (event.isTrusted) {
    msg[TransferrableKeys.isTrusted] = event.isTrusted;
  }

  if (event.returnValue) {
    msg[TransferrableKeys.returnValue] = event.returnValue;
  }

  const targetIndex = (event.target as RenderableElement)._index_;
  if (targetIndex) {
    msg[TransferrableKeys.target] = targetIndex;
  }

  const currentTargetIndex = (event.currentTarget as RenderableElement)._index_;
  if (currentTargetIndex) {
    msg[TransferrableKeys.currentTarget] = currentTargetIndex;
  }

  if ('keyCode' in event) {
    msg[TransferrableKeys.keyCode] = event.keyCode;
  }

  if ('pageX' in event) {
    msg[TransferrableKeys.pageX] = event.pageX;
  }

  if ('pageY' in event) {
    msg[TransferrableKeys.pageY] = event.pageY;
  }

  if ('offsetX' in event) {
    msg[TransferrableKeys.offsetX] = event.offsetX;
  }

  if ('offsetY' in event) {
    msg[TransferrableKeys.offsetY] = event.offsetY;
  }

  if ('clientX' in event) {
    msg[TransferrableKeys.clientX] = event.clientX;
  }

  if ('clientY' in event) {
    msg[TransferrableKeys.clientY] = event.clientY;
  }

  if ('button' in event && event.button) {
    msg[TransferrableKeys.button] = event.button;
  }

  if ('buttons' in event && event.buttons) {
    msg[TransferrableKeys.buttons] = event.buttons;
  }

  if ('detail' in event && event.detail) {
    msg[TransferrableKeys.detail] = event.detail;
  }

  if ('touches' in event) {
    msg[TransferrableKeys.touches] = createTransferrableTouchList(event.touches);
  }

  if ('changedTouches' in event) {
    msg[TransferrableKeys.changedTouches] = createTransferrableTouchList(event.changedTouches);
  }

  const listenableProperties: any[] = getListenableProperties(target, strings);
  if (listenableProperties.length > 0) {
    msg[TransferrableKeys.listenableProperties] = listenableProperties;
  }

  if (target && typeof target.getBoundingClientRect == 'function' && target.isConnected) {
    msg[TransferrableKeys.boundingClientRect] = target.getBoundingClientRect();
  }

  return msg as TransferrableEvent;
}

function getListenableProperties(target: RenderableElement, strings: StringContext) {
  const listenableProperties: any[] = [];

  if (target && target._listenableProperties_) {
    target._listenableProperties_
      .map((prop) => strings.get(prop))
      .map((name) => {
        if (name.length > 0 && name in target) {
          return target[name];
        }
        return null;
      })
      .forEach((value) => listenableProperties.push(value));
  }

  return listenableProperties;
}
