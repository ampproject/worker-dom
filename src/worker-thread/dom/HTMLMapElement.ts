import { registerSubclass, Element } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';
import { matchChildrenElements } from './matchElements';

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
