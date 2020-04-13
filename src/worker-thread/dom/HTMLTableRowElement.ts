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
import { matchNearestParent, tagNameConditionPredicate, ConditionPredicate, matchChildrenElements } from './matchElements';
import { HTMLTableElement } from './HTMLTableElement';
import { Document } from './Document';
import { HTMLTableCellElement } from './HTMLTableCellElement';

const TABLE_SECTION_TAGNAMES = 'TABLE TBODY THEAD TFOOT'.split(' ');

const indexInAncestor = (element: HTMLTableRowElement, isValidAncestor: ConditionPredicate): number => {
  const parent: Element | null = matchNearestParent(element, isValidAncestor);
  // TODO(KB): This is either a HTMLTableElement or HTMLTableSectionElement.
  return parent === null ? -1 : (parent as HTMLTableElement).rows.indexOf(element);
};

export class HTMLTableRowElement extends HTMLElement {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement
   * @return td and th elements that are children of this row.
   */
  get cells(): Array<HTMLTableCellElement> {
    return matchChildrenElements(this, tagNameConditionPredicate(['TD', 'TH'])) as Array<HTMLTableCellElement>;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement
   * @return position of the row within a table, if not nested within in a table the value is -1.
   */
  get rowIndex(): number {
    return indexInAncestor(this, tagNameConditionPredicate(['TABLE']));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement
   * @return position of the row within a parent section, if not nested directly in a section the value is -1.
   */
  get sectionRowIndex(): number {
    return indexInAncestor(this, tagNameConditionPredicate(TABLE_SECTION_TAGNAMES));
  }

  /**
   * Removes the cell in provided position of this row.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement
   * @param index position of the cell in the row to remove.
   */
  public deleteCell(index: number) {
    const cell = this.cells[index];
    if (cell) {
      cell.remove();
    }
  }

  /**
   * Insert a new cell ('td') in the row at a specified position.
   * @param index position in the children to insert before.
   * @return newly inserted td element.
   */
  public insertCell(index: number): HTMLTableCellElement {
    const cells = this.cells;
    const td = (this.ownerDocument as Document).createElement('td') as HTMLTableCellElement;
    if (index < 0 || index >= cells.length) {
      this.appendChild(td);
    } else {
      this.insertBefore(td, this.children[index]);
    }
    return td;
  }
}
registerSubclass('tr', HTMLTableRowElement);
