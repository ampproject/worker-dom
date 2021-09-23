import { registerSubclass, Element } from './Element';
import { HTMLElement } from './HTMLElement';
import { Node } from './Node';

export class HTMLDataListElement extends HTMLElement {
  /**
   * Getter returning option elements that are direct children of a HTMLDataListElement
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDataListElement
   * @return Element "options" objects that are direct children.
   */
  get options(): Array<Element> {
    return this.childNodes.filter((node: Node): boolean => node.nodeName === 'OPTION') as Element[];
  }
}
registerSubclass('datalist', HTMLDataListElement);

/**
 * HTMLDataListElement.options Read only
 * Is a HTMLCollection representing a collection of the contained option elements.
 */

/**
 * <label for="myBrowser">Choose a browser from this list:</label>
 * <input list="browsers" id="myBrowser" name="myBrowser" />
 * <datalist id="browsers">
 *   <option value="Chrome">
 *   <option value="Firefox">
 *   <option value="Internet Explorer">
 *   <option value="Opera">
 *   <option value="Safari">
 *   <option value="Microsoft Edge">
 * </datalist>
 */
