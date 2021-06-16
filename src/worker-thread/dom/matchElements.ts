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
import { toLower, toUpper } from '../../utils';
import { Node } from './Node';
import { NodeType } from '../../transfer/TransferrableNodes';

export type ConditionPredicate = (element: Element) => boolean;
// To future authors: It would be great if we could enforce that elements are not modified by a ConditionPredicate.

export const tagNameConditionPredicate = (tagNames: Array<string>): ConditionPredicate => (element: Element): boolean => {
  console.assert(
    tagNames.every((t) => t === toUpper(t)),
    'tagNames must be all uppercase.',
  );
  return tagNames.includes(element.tagName);
};

export const elementPredicate = (node: Node): boolean => node.nodeType === NodeType.ELEMENT_NODE;

export const matchChildrenElements = (node: Node, conditionPredicate: ConditionPredicate): Element[] => {
  const matchingElements: Element[] = [];
  node.childNodes.forEach((child) => {
    if (elementPredicate(child)) {
      if (conditionPredicate(child as Element)) {
        matchingElements.push(child as Element);
      }
      matchingElements.push(...matchChildrenElements(child as Element, conditionPredicate));
    }
  });
  return matchingElements;
};

export const matchChildElement = (element: Element, conditionPredicate: ConditionPredicate): Element | null => {
  let returnValue: Element | null = null;
  element.children.some((child) => {
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

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
 * @param attrSelector the selector we are trying to match for.
 * @param element the element being tested.
 * @return boolean for whether we match the condition
 */
export const matchAttrReference = (attrSelector: string | null, element: Element): boolean => {
  if (!attrSelector) {
    return false;
  }
  const equalPos: number = attrSelector.indexOf('=');
  const selectorLength: number = attrSelector.length;
  const caseInsensitive = attrSelector.charAt(selectorLength - 2) === 'i';
  const endPos = caseInsensitive ? selectorLength - 3 : selectorLength - 1;
  if (equalPos !== -1) {
    const equalSuffix: string = attrSelector.charAt(equalPos - 1);
    const possibleSuffixes: string[] = ['~', '|', '$', '^', '*'];
    const attrString: string = possibleSuffixes.includes(equalSuffix) ? attrSelector.substring(1, equalPos - 1) : attrSelector.substring(1, equalPos);
    const rawValue: string = attrSelector.substring(equalPos + 1, endPos);
    const rawAttrValue: string | null = element.getAttribute(attrString);
    if (rawAttrValue) {
      const casedValue: string = caseInsensitive ? toLower(rawValue) : rawValue;
      const casedAttrValue: string = caseInsensitive ? toLower(rawAttrValue) : rawAttrValue;
      switch (equalSuffix) {
        case '~':
          return casedAttrValue.split(' ').indexOf(casedValue) !== -1;
        case '|':
          return casedAttrValue === casedValue || casedAttrValue === `${casedValue}-`;
        case '^':
          return casedAttrValue.startsWith(casedValue);
        case '$':
          return casedAttrValue.endsWith(casedValue);
        case '*':
          return casedAttrValue.indexOf(casedValue) !== -1;
        default:
          return casedAttrValue === casedValue;
      }
    }
    return false;
  } else {
    return element.hasAttribute(attrSelector.substring(1, endPos));
  }
};
