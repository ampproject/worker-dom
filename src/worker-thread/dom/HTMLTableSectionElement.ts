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
import { tagNameConditionPredicate, matchChildrenElements } from './matchElements';
import { Document } from './Document';
import { HTMLTableRowElement } from './HTMLTableRowElement';

export class HTMLTableSectionElement extends HTMLElement {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableSectionElement
   * @return All rows (tr elements) within the table section.
   */
  get rows(): Array<HTMLTableRowElement> {
    return matchChildrenElements(this, tagNameConditionPredicate(['TR'])) as Array<HTMLTableRowElement>;
  }

  /**
   * Remove a node in a specified position from the section.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableSectionElement
   * @param index position in the section to remove the node of.
   */
  public deleteRow(index: number): void {
    const rows = this.rows;
    if (index >= 0 || index <= rows.length) {
      rows[index].remove();
    }
  }

  /**
   * Insert a new row ('tr') in the row at a specified position.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableSectionElement
   * @param index position in the children to insert before.
   * @return newly inserted tr element.
   */
  public insertRow(index: number): HTMLTableRowElement {
    const rows = this.rows;
    const tr = (this.ownerDocument as Document).createElement('tr') as HTMLTableRowElement;
    if (index < 0 || index >= rows.length) {
      this.appendChild(tr);
    } else {
      this.insertBefore(tr, this.children[index]);
    }
    return tr;
  }
}
registerSubclass('thead', HTMLTableSectionElement);
registerSubclass('tfoot', HTMLTableSectionElement);
registerSubclass('tbody', HTMLTableSectionElement);
