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

/**
 * Intentionally not a const enum so TS will generate reverse mappings.
 * @see https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings
 */
export enum TransferrableKeys {
  nodeType,
  nodeName,
  attributes,
  properties,
  childNodes,
  textContent,
  namespaceURI,
  _index_,
  transferred,
  type,
  target,
  addedNodes,
  removedNodes,
  previousSibling,
  nextSibling,
  attributeName,
  attributeNamespace,
  propertyName,
  value,
  oldValue,
  addedEvents,
  removedEvents,
  bubbles,
  cancelable,
  cancelBubble,
  currentTarget,
  defaultPrevented,
  eventPhase,
  isTrusted,
  returnValue,
  timeStamp,
  scoped,
  keyCode,
  index,
  mutations,
  nodes,
  data,
  event,
  sync,
  strings,
}
