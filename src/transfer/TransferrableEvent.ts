import { TransferredNode } from './TransferrableNodes';
import { TransferrableKeys } from './TransferrableKeys';

interface TransferrableTouch {
  [key: number]: number;
}
export const enum TransferrableTouchIndex {
  Identifier = 0,
  ScreenX = 1,
  ScreenY = 2,
  ClientX = 3,
  ClientY = 4,
  PageX = 5,
  PageY = 6,
  Target = 7,
}
export interface TransferrableTouchList {
  [key: number]: TransferrableTouch;
}

export interface TransferrableEvent {
  readonly [TransferrableKeys.index]: number;
  readonly [TransferrableKeys.bubbles]?: boolean;
  readonly [TransferrableKeys.cancelable]?: boolean;
  [TransferrableKeys.cancelBubble]?: boolean;
  readonly [TransferrableKeys.currentTarget]?: TransferredNode;
  readonly [TransferrableKeys.defaultPrevented]?: boolean;
  readonly [TransferrableKeys.eventPhase]?: number;
  readonly [TransferrableKeys.isTrusted]?: boolean;
  [TransferrableKeys.returnValue]?: boolean;
  // readonly srcElement: TransferrableTarget | null;
  readonly [TransferrableKeys.target]: TransferredNode | null;
  readonly [TransferrableKeys.timeStamp]?: number;
  readonly [TransferrableKeys.type]: string;
  readonly [TransferrableKeys.scoped]?: boolean;
  readonly [TransferrableKeys.keyCode]?: number;
  readonly [TransferrableKeys.pageX]?: number;
  readonly [TransferrableKeys.pageY]?: number;
  readonly [TransferrableKeys.offsetX]?: number;
  readonly [TransferrableKeys.offsetY]?: number;
  readonly [TransferrableKeys.touches]?: TransferrableTouchList;
  readonly [TransferrableKeys.changedTouches]?: TransferrableTouchList;
}

/**
 * Add Event Registration Transfer
 *
 * [
 *   type,
 *   index,
 *   capture,
 *   once,
 *   passive,
 *   workerDOMPreventDefault
 * ]
 */
export const enum AddEventRegistrationIndex {
  Type = 0,
  Index = 1,
  Capture = 2,
  Once = 3,
  Passive = 4,
  WorkerDOMPreventDefault = 5,
}
export const ADD_EVENT_SUBSCRIPTION_LENGTH = 6;

/**
 * Remove Event Registration Transfer
 */
export const enum RemoveEventRegistrationIndex {
  Type = 0,
  Index = 1,
}
export const REMOVE_EVENT_SUBSCRIPTION_LENGTH = 2;

/**
 * Event Subscription Transfer
 *
 * [
 *   TransferrableMutationType.EVENT_SUBSCRIPTION,
 *   Target.index,
 *   RemoveEventListener.count,
 *   AddEventListener.count,
 *   ...RemoveEvent<RemoveEventRegistration>,
 *   ...AddEvent<AddEventRegistration>,
 * ]
 */
export const enum EventSubscriptionMutationIndex {
  Target = 1,
  RemoveEventListenerCount = 2,
  AddEventListenerCount = 3,
  Events = 4,
  End = 4,
}
