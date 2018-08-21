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

import { Element } from './Element';

export type ConditionPredicate = (element: Element) => boolean;
// To future authors: It would be great if we could enforce that elements are not modified by a ConditionPredicate.

export const tagNameConditionPredicate = (tagNames: Array<string>): ConditionPredicate => (element: Element): boolean =>
  tagNames.includes(element.tagName);

export const matchChildrenElements = (element: Element, conditionPredicate: ConditionPredicate): Element[] => {
  const matchingElements: Element[] = [];
  element.children.forEach(child => {
    if (conditionPredicate(child)) {
      matchingElements.push(child);
    }
    matchingElements.push(...matchChildrenElements(child, conditionPredicate));
  });
  return matchingElements;
};

export const matchChildElement = (element: Element, conditionPredicate: ConditionPredicate): Element | null => {
  let returnValue: Element | null = null;
  element.children.some(child => {
    if (conditionPredicate(child)) {
      returnValue = child;
      return true;
    }
    const grandChildMatch = matchChildElement(child, conditionPredicate);
    if (grandChildMatch !== null) {
      returnValue = grandChildMatch;
      return true;
    }
    return false;
  });

  return returnValue;
};

export const matchNearestParent = (element: Element, conditionPredicate: ConditionPredicate): Element | null => {
  while ((element = element.parentNode as Element)) {
    if (conditionPredicate(element)) {
      return element;
    }
  }
  return null;
};
