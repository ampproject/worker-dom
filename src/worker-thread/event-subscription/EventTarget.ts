import { AddEventListenerOptions, Event, EventHandler } from '../Event';
import { toLower } from '../../utils';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { transfer } from '../MutationTransfer';
import { Document } from '../dom/Document';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { TransferrableObject } from '../worker-thread';

export abstract class EventTarget implements TransferrableObject {
  readonly document: Document;
  protected [TransferrableKeys.handlers]: {
    [index: string]: EventHandler[];
  } = {};

  protected constructor(document: Document | null) {
    this.document = document || (this as any);
  }

  abstract [TransferrableKeys.serializeAsTransferrableObject](): number[];

  abstract parent(): any;

  /**
   * Add an event listener to callback when a specific event type is dispatched.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function called when event is dispatched.
   */
  public addEventListener(type: string, handler: EventHandler, options: AddEventListenerOptions | undefined = {}): void {
    const lowerType = toLower(type);
    const handlers: EventHandler[] = this[TransferrableKeys.handlers][lowerType];
    if (handlers && handlers.length > 0) {
      handlers.push(handler);
    } else {
      this[TransferrableKeys.handlers][lowerType] = [handler];
      transfer(this.document as Document, [
        TransferrableMutationType.EVENT_SUBSCRIPTION,
        this,
        true,
        lowerType,
        Boolean(options.workerDOMPreventDefault),
      ]);
    }
  }

  /**
   * Remove a registered event listener for a specific event type.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   * @param type Event Type (i.e 'click')
   * @param handler Function to stop calling when event is dispatched.
   */
  public removeEventListener(type: string, handler: EventHandler): void {
    const lowerType = toLower(type);
    const handlers = this[TransferrableKeys.handlers][lowerType];
    const index = !!handlers ? handlers.indexOf(handler) : -1;

    if (index >= 0) {
      handlers.splice(index, 1);
      if (handlers.length == 0) {
        transfer(this.document, [TransferrableMutationType.EVENT_SUBSCRIPTION, this, false, lowerType, false]);
      }
    }
  }

  /**
   * Dispatch an event for this Node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
   * @param event Event to dispatch to this node and potentially cascade to parents.
   */
  public dispatchEvent(event: Event): boolean {
    let target: EventTarget | null = (event.currentTarget = this);
    event.target = event.target || target;
    let handlers: EventHandler[] | null;
    let iterator: number;

    do {
      handlers = target && target[TransferrableKeys.handlers] && target[TransferrableKeys.handlers][toLower(event.type)];
      if (handlers) {
        for (iterator = handlers.length; iterator--; ) {
          if ((handlers[iterator].call(target, event) === false || event[TransferrableKeys.end]) && event.cancelable) {
            break;
          }
        }
      }
    } while (event.bubbles && !(event.cancelable && event[TransferrableKeys.stop]) && (target = target && target.parent()));
    return !event.defaultPrevented;
  }
}

export const appendGlobalEventProperties = (type: any, keys: Array<string>): void => {
  const keysToAppend = keys.filter((key) => !type.prototype.hasOwnProperty(key));
  if (keysToAppend.length <= 0) {
    return;
  }

  keysToAppend.forEach((key: string): void => {
    const normalizedKey = key.replace(/on/, '');
    Object.defineProperty(type.prototype, key, {
      enumerable: true,
      get(): string {
        return this[TransferrableKeys.propertyEventHandlers][normalizedKey] || null;
      },
      set(value) {
        const stored = this[TransferrableKeys.propertyEventHandlers][normalizedKey];
        if (stored) {
          this.removeEventListener(normalizedKey, stored);
        }
        if (typeof value === 'function') {
          this.addEventListener(normalizedKey, value);
        }
        this[TransferrableKeys.propertyEventHandlers][normalizedKey] = value;
      },
    });
  });
};
