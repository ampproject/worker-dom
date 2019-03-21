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
}

export const ReadableMutationType: { [key: number]: string } = {
  0: 'ATTRIBUTES',
  1: 'CHARACTER_DATA',
  2: 'CHILD_LIST',
  3: 'PROPERTIES',
  4: 'EVENT_SUBSCRIPTION',
  5: 'GET_BOUNDING_CLIENT_RECT',
  6: 'LONG_TASK_START',
  7: 'LONG_TASK_END',
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
  LastStaticNode = 5,
}

/**
 * Attribute Mutations
 * [
 *   TransferrableMutationType.ATTRIBUTES,
 *   Target.index,
 *   Attr.name,
 *   Attr.namespace,   // 0 the default value.
 *   Attr.value,
 * ]
 */
export const enum AttributeMutationIndex {
  Target = 1,
  Name = 2,
  Namespace = 3,
  Value = 4,
  LastStaticNode = 4,
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
  LastStaticNode = 2,
}

/**
 * Properties Mutations
 * [
 *   TransferrableMutationType.PROPERTIES,
 *   Target.index,
 *   Property.name,
 *   Property.value,
 * ]
 */
export const enum PropertyMutationIndex {
  Target = 1,
  Name = 2,
  Value = 3,
  LastStaticNode = 3,
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
  LastStaticNode = 1,
}
