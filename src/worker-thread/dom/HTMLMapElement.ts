import { registerSubclass, Element } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import { reflectProperties } from './enhanceElement.js';
import { matchChildrenElements } from './matchElements.js';

export class HTMLMapElement extends HTMLElement {
  /**
   * Getter returning area elements associated to this map.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMapElement
   * @return area elements associated to this map.
   */
  get areas(): Array<Element> {
    return matchChildrenElements(this as Element, (element) => element.tagName === 'AREA');
  }
}
registerSubclass('map', HTMLMapElement);

// Reflected Properties
// HTMLMapElement.name => string, reflected attribute
reflectProperties([{ name: [''] }], HTMLMapElement);
