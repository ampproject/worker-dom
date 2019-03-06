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
