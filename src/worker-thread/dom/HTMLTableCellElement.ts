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

import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { DOMTokenList } from './DOMTokenList';
import { matchNearestParent, tagNameConditionPredicate, matchChildrenElements } from './matchElements';

export class HTMLTableCellElement extends HTMLElement {
  public headers: DOMTokenList = new DOMTokenList(HTMLTableCellElement, this, 'headers', null, null);

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement
   * @return position of the cell within the parent tr, if not nested in a tr the value is -1.
   */
  get cellIndex(): number {
    const parent = matchNearestParent(this, tagNameConditionPredicate(['tr']));
    return parent !== null ? matchChildrenElements(parent, tagNameConditionPredicate(['th', 'td'])).indexOf(this) : -1;
  }
}
registerSubclass('th', HTMLTableCellElement);
registerSubclass('td', HTMLTableCellElement);

// Reflected Properties
// HTMLTableCellElement.abbr => string, reflected attribute
// HTMLTableCellElement.colSpan => number, reflected attribute
// HTMLTableCellElement.rowSpan => number, reflected attribute
// HTMLTableCellElement.scope => string, reflected attribute
reflectProperties([{ abbr: [''] }, { colSpan: [1] }, { rowSpan: [1] }, { scope: [''] }], HTMLTableCellElement);
