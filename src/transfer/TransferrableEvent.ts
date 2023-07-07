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
  readonly [TransferrableKeys.clientX]?: number;
  readonly [TransferrableKeys.clientY]?: number;
  readonly [TransferrableKeys.button]?: number;
  readonly [TransferrableKeys.buttons]?: number;
  readonly [TransferrableKeys.detail]?: number;
  readonly [TransferrableKeys.listenableProperties]?: any[];
}

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
  IsAddEvent = 2,
  EventType = 3,
  PreventDefault = 4,
  End = 5,
}
