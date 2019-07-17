/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

export const enum TransferrableMutationType {
  ATTRIBUTES = 0,
  CHARACTER_DATA = 1,
  CHILD_LIST = 2,
  PROPERTIES = 3,
  EVENT_SUBSCRIPTION = 4,
  GET_BOUNDING_CLIENT_RECT = 5,
  LONG_TASK_START = 6,
  LONG_TASK_END = 7,
  OFFSCREEN_CANVAS_INSTANCE = 8,
  OBJECT_MUTATION = 9,
  OBJECT_CREATION = 10,
  IMAGE_BITMAP_INSTANCE = 11,
  STORAGE = 12,
}

export const DefaultAllowedMutations = [
  TransferrableMutationType.ATTRIBUTES,
  TransferrableMutationType.CHARACTER_DATA,
  TransferrableMutationType.CHILD_LIST,
  TransferrableMutationType.PROPERTIES,
  TransferrableMutationType.EVENT_SUBSCRIPTION,
  TransferrableMutationType.GET_BOUNDING_CLIENT_RECT,
  TransferrableMutationType.LONG_TASK_START,
  TransferrableMutationType.LONG_TASK_END,
  TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE,
  TransferrableMutationType.OBJECT_MUTATION,
  TransferrableMutationType.OBJECT_CREATION,
  TransferrableMutationType.IMAGE_BITMAP_INSTANCE,
  TransferrableMutationType.STORAGE,
];

export const ReadableMutationType: { [key: number]: string } = {
  0: 'ATTRIBUTES',
  1: 'CHARACTER_DATA',
  2: 'CHILD_LIST',
  3: 'PROPERTIES',
  4: 'EVENT_SUBSCRIPTION',
  5: 'GET_BOUNDING_CLIENT_RECT',
  6: 'LONG_TASK_START',
  7: 'LONG_TASK_END',
  8: 'OFFSCREEN_CANVAS_INSTANCE',
  9: 'OBJECT_MUTATION',
  10: 'OBJECT_CREATION',
  11: 'IMAGE_BITMAP_INSTANCE',
  12: 'STORAGE',
};

/**
 * Child List Mutations
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
export const enum ChildListMutationIndex {
  Target = 1,
  NextSibling = 2,
  PreviousSibling = 3,
  AppendedNodeCount = 4,
  RemovedNodeCount = 5,
  Nodes = 6,
  End = 6,
}

/**
 * Attribute Mutations
 * [
 *   TransferrableMutationType.ATTRIBUTES,
 *   Target.index,
 *   Attr.name,
 *   Attr.namespace,   // 0 is the default value.
 *   Attr.value,       // 0 is the default value.
 * ]
 */
export const enum AttributeMutationIndex {
  Target = 1,
  Name = 2,
  Namespace = 3,
  Value = 4,
  End = 5,
}

/**
 * Character Data Mutations
 * [
 *   TransferrableMutationType.CHARACTER_DATA,
 *   Target.index,
 *   CharacterData.value,
 * ]
 */
export const enum CharacterDataMutationIndex {
  Target = 1,
  Value = 2,
  End = 3,
}

/**
 * Properties Mutations
 * [
 *   TransferrableMutationType.PROPERTIES,
 *   Target.index,
 *   Property.name,
 *   typeof Property.value === boolean,
 *   Property.value,
 * ]
 */
export const enum PropertyMutationIndex {
  Target = 1,
  Name = 2,
  IsBoolean = 3,
  Value = 4,
  End = 5,
}

/**
 * Long Task Mutations
 * [
 *   TransferrableMutationType.LONG_TASK_START || TransferrableMutation.LONG_TASK_END
 *   Target.index,
 * ]
 */
export const enum LongTaskMutationIndex {
  Target = 1,
  End = 2,
}

/**
 * OffscreenCanvas Mutations
 * [
 *   TransferableMutationType.OFFSCREEN_CANVAS_INSTANCE,
 *   Target.index,
 * ]
 */
export const enum OffscreenCanvasMutationIndex {
  Target = 1,
  End = 2,
}

/**
 * ImageBitmap Mutations
 * [
 *   TransferableMutationType.IMAGE_BITMAP_INSTANCE,
 *   Target.index,
 * ]
 */
export const enum ImageBitmapMutationIndex {
  Target = 1,
  CallIndex = 2,
  End = 3,
}

/**
 * ObjectMutation Mutations
 * [
 *   TransferableMutationType.IMAGE_BITMAP_INSTANCE,
 *   Target.index,
 * ]
 * // TODO(choumx): Fix naming inconsistency.
 */
export const enum ObjectMutationIndex {
  FunctionName = 1,
  ArgumentCount = 2,
  SerializedTarget = 3,
  // "End" index is variable.
}

/**
 * ObjectCreation Mutations
 * [
 *   TransferableMutationType.IMAGE_BITMAP_INSTANCE,
 *   Target.index,
 * ]
 * // TODO(choumx): Fix naming inconsistency.
 */
export const enum ObjectCreationIndex {
  FunctionName = 1,
  ObjectId = 2,
  ArgumentCount = 3,
  SerializedTarget = 4,
  // "End" index is variable.
}

/**
 * Used in OBJECT_MUTATION and OBJECT_CREATION mutations for typing non-primitives
 * passed in function parameters, e.g. <image> in CanvasRenderingContext2D.drawImage(<image>).
 */
export const enum TransferrableObjectType {
  SmallInt = 1,
  Float = 2,
  String = 3,
  Array = 4,
  TransferObject = 5,
  CanvasRenderingContext2D = 6,
  HTMLElement = 7,
}

/**
 * Storage Mutations
 * [
 *   TransferableMutationType.STORAGE,
 *   StorageLocation,
 *   string(key),
 *   string(value),
 * ]
 */
export const enum StorageMutationIndex {
  Location = 1,
  Key = 2,
  Value = 3,
  End = 4,
}
