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
