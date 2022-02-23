import { TransferrableEvent } from './TransferrableEvent';
import { TransferrableSyncValue } from './TransferrableSyncValue';
import { TransferrableKeys } from './TransferrableKeys';
import { HydrateableNode, TransferredNode } from './TransferrableNodes';
import { TransferrableBoundingClientRect } from './TransferrableBoundClientRect';
import { Phase } from './Phase';
import { StorageLocation } from './TransferrableStorage';

export const enum MessageType {
  // INIT = 0,
  EVENT = 1,
  HYDRATE = 2,
  MUTATE = 3,
  SYNC = 4,
  RESIZE = 5,
  GET_BOUNDING_CLIENT_RECT = 6,
  LONG_TASK_START = 7,
  LONG_TASK_END = 8,
  OFFSCREEN_CANVAS_INSTANCE = 9,
  IMAGE_BITMAP_INSTANCE = 10,
  GET_STORAGE = 11,
  FUNCTION = 12,
  // NAVIGATION_PUSH_STATE = 8,
  // NAVIGATION_REPLACE_STATE = 9,
  // NAVIGATION_POP_STATE = 10,
}

export interface MutationFromWorker {
  readonly [TransferrableKeys.type]: MessageType;
  readonly [TransferrableKeys.phase]: Phase;
  readonly [TransferrableKeys.strings]: Array<string>;
  readonly [TransferrableKeys.nodes]: ArrayBuffer;
  readonly [TransferrableKeys.mutations]: ArrayBuffer;
}
export type MessageFromWorker = {
  data: MutationFromWorker;
};

export interface HydrationToWorker {
  readonly [TransferrableKeys.type]: MessageType.HYDRATE;
  readonly [TransferrableKeys.strings]: Array<string>;
  readonly [TransferrableKeys.nodes]: HydrateableNode;
}
export interface EventToWorker {
  [TransferrableKeys.type]: MessageType.EVENT;
  [TransferrableKeys.event]: TransferrableEvent;
}
export interface ValueSyncToWorker {
  [TransferrableKeys.type]: MessageType.SYNC;
  [TransferrableKeys.sync]: TransferrableSyncValue;
}
export interface BoundingClientRectToWorker {
  [TransferrableKeys.type]: MessageType.GET_BOUNDING_CLIENT_RECT;
  [TransferrableKeys.target]: TransferredNode;
  [TransferrableKeys.data]: TransferrableBoundingClientRect;
}
export interface OffscreenCanvasToWorker {
  [TransferrableKeys.type]: MessageType.OFFSCREEN_CANVAS_INSTANCE;
  [TransferrableKeys.target]: TransferredNode;
  [TransferrableKeys.data]: {}; // This will be an OffscreenCanvas
}
export interface ImageBitmapToWorker {
  [TransferrableKeys.type]: MessageType.IMAGE_BITMAP_INSTANCE;
  [TransferrableKeys.callIndex]: number; // number that indicates the number of the image bitmap call
  [TransferrableKeys.data]: {}; // This will be an ImageBitmap object
}
export interface ResizeSyncToWorker {
  [TransferrableKeys.type]: MessageType.RESIZE;
  [TransferrableKeys.sync]: [number, number];
}
export interface StorageValueToWorker {
  [TransferrableKeys.type]: MessageType.GET_STORAGE;
  [TransferrableKeys.storageKey]: string;
  [TransferrableKeys.storageLocation]: StorageLocation;
  [TransferrableKeys.value]: { [key: string]: string };
}

export interface FunctionCallToWorker {
  [TransferrableKeys.type]: MessageType.FUNCTION;
  [TransferrableKeys.index]: number;
  [TransferrableKeys.functionIdentifier]: string;
  [TransferrableKeys.functionArguments]: string;
}

export type MessageToWorker =
  | EventToWorker
  | ValueSyncToWorker
  | BoundingClientRectToWorker
  | ResizeSyncToWorker
  | OffscreenCanvasToWorker
  | ImageBitmapToWorker
  | StorageValueToWorker
  | FunctionCallToWorker;

/**
 * Can parameterize a method invocation message as a getter or setter.
 */
export const enum GetOrSet {
  GET = 1,
  SET = 2,
}

/**
 * Can parameterize a method invocation value as a resolved or rejected.
 */
export const enum ResolveOrReject {
  RESOLVE = 1,
  REJECT = 2,
}
