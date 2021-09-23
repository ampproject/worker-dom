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
