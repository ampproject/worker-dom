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
import { DOMTokenList, synchronizedAccessor } from './DOMTokenList';

export class HTMLLinkElement extends HTMLElement {
  private _relList: DOMTokenList;

  public get relList(): DOMTokenList {
    return this._relList || (this._relList = new DOMTokenList(this, 'rel'));
  }
}
registerSubclass('link', HTMLLinkElement);
definePropertyBackedAttributes(HTMLLinkElement, {
  rel: [(el): string | null => el.relList.value, (el, value: string) => (el.relList.value = value)],
});
synchronizedAccessor(HTMLLinkElement, 'relList', 'rel');

// Reflected Properties
// HTMLLinkElement.as => string, reflected attribute
// HTMLLinkElement.crossOrigin => string, reflected attribute
// HTMLLinkElement.disabled => boolean, reflected attribute
// HTMLLinkElement.href => string, reflected attribute
// HTMLLinkElement.hreflang => string, reflected attribute
// HTMLLinkElement.media => string, reflected attribute
// HTMLLinkElement.referrerPolicy => string, reflected attribute
// HTMLLinkElement.sizes => string, reflected attribute
// HTMLLinkElement.type => string, reflected attribute
reflectProperties(
  [
    { as: [''] },
    { crossOrigin: [''] },
    { disabled: [false] },
    { href: [''] },
    { hreflang: [''] },
    { media: [''] },
    { referrerPolicy: [''] },
    { sizes: [''] },
    { type: [''] },
  ],
  HTMLLinkElement,
);

// Unimplemented Properties
// LinkStyle.sheet Read only
// Returns the StyleSheet object associated with the given element, or null if there is none.
