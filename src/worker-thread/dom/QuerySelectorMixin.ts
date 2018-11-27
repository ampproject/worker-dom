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

import { Node } from './Node';
import { Element } from './Element';
import { containsIndexOf, toLower } from '../../utils';
import { matchAttrReference, matchChildrenElements } from './matchElements';
import { DocumentFragment } from './DocumentFragment';
import { NodeType } from '../../transfer/TransferrableNodes';

export const QuerySelectorMixin = (defineOn: typeof Element | typeof DocumentFragment): void => {
  if (!('querySelector' in defineOn.prototype)) {
    Object.defineProperties(defineOn.prototype, {
      querySelector: {
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
         * @param selector the selector we are trying to match for.
         * @return Element with matching selector.
         */
        get(): (selector: string) => Element | null {
          return (selector: string): Element | null => {
            const matches: Element[] | null = querySelectorAll(this, selector);
            return matches ? matches[0] : null;
          };
        },
      },
      querySelectorAll: {
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
         * @param selector the selector we are trying to match for.
         * @return Element with matching selector.
         */
        get(): (selector: string) => Element[] | null {
          return (selector: string) => {
            //console.log(this.nodeName, this.childNodes[0].childNodes[0].className, `qsa(${this}, ${selector})`);

            return querySelectorAll(this, selector);
          };
        },
      },
    });
  }
};

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
    matcher = element => matchAttrReference(selector, element);
  } else if (elementSelector[0] === '#') {
    matcher = selectorHasAttr
      ? element => element.id === elementSelector.substr(1) && matchAttrReference(attrSelector, element)
      : element => element.id === elementSelector.substr(1);
  } else if (elementSelector[0] === '.') {
    matcher = selectorHasAttr
      ? element => {
          //console.log('in qsa', element.classList);
          return element.classList.contains(elementSelector.substr(1)) && matchAttrReference(attrSelector, element);
        }
      : element => {
          //console.log('in qsa', element.classList);
          return element.classList.contains(elementSelector.substr(1));
        };
  } else {
    matcher = selectorHasAttr
      ? element => element.localName === toLower(elementSelector) && matchAttrReference(attrSelector, element)
      : element => element.localName === toLower(elementSelector);
  }

  // Third, filter to return elements that exist within the querying element's descendants.
  const rootNode = node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE ? node : node.ownerDocument.documentElement;
  return matcher ? matchChildrenElements(rootNode, matcher).filter(element => node !== element && node.contains(element)) : [];
}
