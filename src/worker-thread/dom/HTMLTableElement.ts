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

import { registerSubclass, Element } from './Element';
import { HTMLElement } from './HTMLElement';
import { matchChildElement, matchChildrenElements, tagNameConditionPredicate } from './matchElements';
import { NodeName } from './Node';
import { HTMLTableSectionElement } from './HTMLTableSectionElement';
import { HTMLTableRowElement } from './HTMLTableRowElement';
import { toUpper } from '../../utils';

const removeElement = (element: Element | null): any => element && element.remove();

const insertBeforeElementsWithTagName = (parent: Element, element: Element, tagNames: Array<NodeName>): void => {
  console.assert(
    tagNames.every((t) => t === toUpper(t)),
    'tagNames must be all uppercase.',
  );
  const insertBeforeElement = matchChildElement(parent, (element: Element): boolean => !tagNames.includes(element.tagName));
  if (insertBeforeElement) {
    parent.insertBefore(element, insertBeforeElement);
  } else {
    parent.appendChild(element);
  }
};

export class HTMLTableElement extends HTMLElement {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/caption
   * @return first matching caption Element or null if none exists.
   */
  get caption(): Element | null {
    return matchChildElement(this, tagNameConditionPredicate(['CAPTION']));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/caption
   * @param element new caption element to replace the existing, or become the first element child.
   */
  set caption(newElement: Element | null) {
    if (newElement && newElement.tagName === 'CAPTION') {
      // If a correct object is given,
      // it is inserted in the tree as the first child of this element and the first <caption>
      // that is a child of this element is removed from the tree, if any.

      removeElement(this.caption);
      this.insertBefore(newElement, this.firstElementChild);
    }
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/tHead
   * @return first matching thead Element or null if none exists.
   */
  get tHead(): HTMLTableSectionElement | null {
    return matchChildElement(this, tagNameConditionPredicate(['THEAD'])) as HTMLTableSectionElement | null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/tHead
   * @param newElement new thead element to insert in this table.
   */
  set tHead(newElement: HTMLTableSectionElement | null) {
    if (newElement && newElement.tagName === 'THEAD') {
      // If a correct object is given,
      // it is inserted in the tree immediately before the first element that is
      // neither a <caption>, nor a <colgroup>, or as the last child if there is no such element.
      // Additionally, the first <thead> that is a child of this element is removed from the tree, if any.

      removeElement(this.tHead);
      insertBeforeElementsWithTagName(this, newElement, ['CAPTION', 'COLGROUP']);
    }
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/tHead
   * @return first matching thead Element or null if none exists.
   */
  get tFoot(): HTMLTableSectionElement | null {
    return matchChildElement(this, tagNameConditionPredicate(['TFOOT'])) as HTMLTableSectionElement | null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/tHead
   * @param newElement new tfoot element to insert in this table.
   */
  set tFoot(newElement: HTMLTableSectionElement | null) {
    if (newElement && newElement.tagName === 'TFOOT') {
      // If a correct object is given,
      // it is inserted in the tree immediately before the first element that is neither a <caption>,
      // a <colgroup>, nor a <thead>, or as the last child if there is no such element, and the first <tfoot> that is a child of
      // this element is removed from the tree, if any.

      removeElement(this.tFoot);
      insertBeforeElementsWithTagName(this, newElement, ['CAPTION', 'COLGROUP', 'THEAD']);
    }
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement
   * @return array of 'tr' tagname elements
   */
  get rows(): Array<HTMLTableRowElement> {
    return matchChildrenElements(this, tagNameConditionPredicate(['TR'])) as Array<HTMLTableRowElement>;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement
   * @return array of 'tbody' tagname elements
   */
  get tBodies(): Array<HTMLTableSectionElement> {
    return matchChildrenElements(this, tagNameConditionPredicate(['TBODY'])) as Array<HTMLTableSectionElement>;
  }
}
registerSubclass('table', HTMLTableElement);

// Unimplemented Properties
// HTMLTableElement.sortable => boolean

// Unimplemented Methods
// HTMLTableElement.createTHead()
// HTMLTableElement.deleteTHead()
// HTMLTableElement.createTFoot()
// HTMLTableElement.deleteTFoot()
// HTMLTableElement.createCaption()
// HTMLTableElement.deleteCaption()
// HTMLTableElement.insertRow()
// HTMLTableElement.deleteRow()
