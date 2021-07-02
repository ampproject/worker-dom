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
import { elementPredicate, matchAttrReference, matchChildrenElements } from './matchElements';
import { Node } from './Node';
import { containsIndexOf, toLower } from '../../utils';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

/*
Normally ParentNode is implemented as a mixin, but since the Node class is an abstract
this makes it hard to build a mixin that recieves a base of the representations of Node needing
the mixed in functionality.

// Partially implemented Mixin Methods
// Both Element.querySelector() and Element.querySelector() are only implemented for the following simple selectors:
// - Element selectors
// - ID selectors
// - Class selectors
// - Attribute selectors
// Element.querySelector() – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
// Element.querySelectorAll() – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
*/
export abstract class ParentNode extends Node {
  /**
   * Getter returning children of an Element that are Elements themselves.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
   * @return Element objects that are children of this ParentNode, omitting all of its non-element nodes.
   */
  get children(): Element[] {
    return this.childNodes.filter(elementPredicate) as Element[];
  }

  /**
   * Getter returning the number of child elements of a Element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/childElementCount
   * @return number of child elements of the given Element.
   */
  get childElementCount(): number {
    return this.children.length;
  }

  /**
   * Getter returning the first Element in Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild
   * @return first childNode that is also an element.
   */
  get firstElementChild(): Element | null {
    return (this.childNodes.find(elementPredicate) as Element) || null;
  }

  /**
   * Getter returning the last Element in Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/lastElementChild
   * @return first childNode that is also an element.
   */
  get lastElementChild(): Element | null {
    const children = this.children;
    return children[children.length - 1] || null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
   * @param selector the selector we are trying to match for.
   * @return Element with matching selector.
   */
  querySelector(selector: string): Element | null {
    const matches: Element[] | null = querySelectorAll(this, selector);
    return matches ? matches[0] : null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
   * @param selector the selector we are trying to match for.
   * @return Elements with matching selector.
   */
  querySelectorAll(selector: string): Element[] | null {
    return querySelectorAll(this, selector);
  }
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
 * @param node the node to filter results under.
 * @param selector the selector we are trying to match for.
 * @return Element with matching selector.
 */
function querySelectorAll(node: Node, selector: string): Element[] | null {
  // As per spec: https://dom.spec.whatwg.org/#scope-match-a-selectors-string
  // First, parse the selector
  const selectorBracketIndexes = [selector.indexOf('['), selector.indexOf(']')];
  const selectorHasAttr = containsIndexOf(selectorBracketIndexes[0]) && containsIndexOf(selectorBracketIndexes[1]);
  const elementSelector = selectorHasAttr ? selector.substring(0, selectorBracketIndexes[0]) : selector;
  const attrSelector = selectorHasAttr ? selector.substring(selectorBracketIndexes[0], selectorBracketIndexes[1] + 1) : null;

  // TODO(nainar): Parsing selectors is needed when we add in more complex selectors.
  // Second, find all the matching elements on the Document
  let matcher: (element: Element) => boolean;
  if (selector[0] === '[') {
    matcher = (element) => matchAttrReference(selector, element);
  } else if (elementSelector[0] === '#') {
    matcher = selectorHasAttr
      ? (element) => element.id === elementSelector.substr(1) && matchAttrReference(attrSelector, element)
      : (element) => element.id === elementSelector.substr(1);
  } else if (elementSelector[0] === '.') {
    matcher = selectorHasAttr
      ? (element) => element.classList.contains(elementSelector.substr(1)) && matchAttrReference(attrSelector, element)
      : (element) => element.classList.contains(elementSelector.substr(1));
  } else {
    matcher = selectorHasAttr
      ? (element) => element.localName === toLower(elementSelector) && matchAttrReference(attrSelector, element)
      : (element) => element.localName === toLower(elementSelector);
  }

  // Third, filter to return elements that exist within the querying element's descendants.
  return matcher
    ? matchChildrenElements(node[TransferrableKeys.scopingRoot], matcher).filter((element) => node !== element && node.contains(element))
    : [];
}
