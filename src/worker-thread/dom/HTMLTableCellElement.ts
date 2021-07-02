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

import { registerSubclass, definePropertyBackedAttributes } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { DOMTokenList } from './DOMTokenList';
import { matchNearestParent, tagNameConditionPredicate, matchChildrenElements } from './matchElements';

export class HTMLTableCellElement extends HTMLElement {
  private _headers: DOMTokenList;

  public get headers(): DOMTokenList {
    return this._headers || (this._headers = new DOMTokenList(this, 'headers'));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement
   * @return position of the cell within the parent tr, if not nested in a tr the value is -1.
   */
  get cellIndex(): number {
    const parent = matchNearestParent(this, tagNameConditionPredicate(['TR']));
    return parent !== null ? matchChildrenElements(parent, tagNameConditionPredicate(['TH', 'TD'])).indexOf(this) : -1;
  }
}
registerSubclass('th', HTMLTableCellElement);
registerSubclass('td', HTMLTableCellElement);
definePropertyBackedAttributes(HTMLTableCellElement, {
  headers: [(el): string | null => el.headers.value, (el, value: string) => (el.headers.value = value)],
});

// Reflected Properties
// HTMLTableCellElement.abbr => string, reflected attribute
// HTMLTableCellElement.colSpan => number, reflected attribute
// HTMLTableCellElement.rowSpan => number, reflected attribute
// HTMLTableCellElement.scope => string, reflected attribute
reflectProperties([{ abbr: [''] }, { colSpan: [1] }, { rowSpan: [1] }, { scope: [''] }], HTMLTableCellElement);
