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

import { TransferrableEvent } from './TransferrableEvent';
import { TransferrableSyncValue } from './TransferrableSyncValue';
import { TransferrableKeys } from './TransferrableKeys';
import { HydrateableNode, TransferredNode } from './TransferrableNodes';
import { TransferrableBoundingClientRect } from './TransferrableBoundClientRect';
import { Phase } from './Phase';

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
  [TransferrableKeys.data]: Object; // This will be an OffscreenCanvas
}
export interface ImageBitmapToWorker {
  [TransferrableKeys.type]: MessageType.IMAGE_BITMAP_INSTANCE;
  [TransferrableKeys.callIndex]: number; // number that indicates the number of the image bitmap call
  [TransferrableKeys.data]: Object; // This will be an ImageBitmap object
}
export interface ResizeSyncToWorker {
  [TransferrableKeys.type]: MessageType.RESIZE;
  [TransferrableKeys.sync]: [number, number];
}
export type MessageToWorker =
  | EventToWorker
  | ValueSyncToWorker
  | BoundingClientRectToWorker
  | ResizeSyncToWorker
  | OffscreenCanvasToWorker
  | ImageBitmapToWorker;
