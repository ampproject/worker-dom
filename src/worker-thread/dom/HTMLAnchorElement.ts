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
import { DOMTokenList, synchronizedAccessor } from './DOMTokenList';
import { reflectProperties } from './enhanceElement';

export class HTMLAnchorElement extends HTMLElement {
  private _relList: DOMTokenList;

  public get relList(): DOMTokenList {
    return this._relList || (this._relList = new DOMTokenList(this, 'rel'));
  }

  /**
   * Returns the href property/attribute value
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/toString
   * @return string href attached to HTMLAnchorElement
   */
  public toString(): string {
    return this.href;
  }

  /**
   * A Synonym for the Node.textContent property getter.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
   * @return value of text node direct child of this Element.
   */
  get text(): string {
    return this.textContent;
  }

  /**
   * A Synonym for the Node.textContent property setter.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
   * @param text replacement for all current childNodes.
   */
  set text(text: string) {
    this.textContent = text;
  }
}
registerSubclass('a', HTMLAnchorElement);
definePropertyBackedAttributes(HTMLAnchorElement, {
  rel: [(el): string | null => el.relList.value, (el, value: string) => (el.relList.value = value)],
});
synchronizedAccessor(HTMLAnchorElement, 'relList', 'rel');

// Reflected properties, strings.
// HTMLAnchorElement.href => string, reflected attribute
// HTMLAnchorElement.hreflang => string, reflected attribute
// HTMLAnchorElement.media => string, reflected attribute
// HTMLAnchorElement.target => string, reflected attribute
// HTMLAnchorElement.type => string, reflected attribute
reflectProperties([{ href: [''] }, { hreflang: [''] }, { media: [''] }, { target: [''] }, { type: [''] }], HTMLAnchorElement);

// Unimplemented
// HTMLAnchorElement.download => string, reflected attribute
// HTMLAnchorElement.type => Is a DOMString that reflects the type HTML attribute, indicating the MIME type of the linked resource.

// Unimplemented URL parse of href attribute due to IE11 compatibility and low usage.
// Note: Implementation doable using a private url property
/*
  class {
    private url: URL | null = null;

    constructor(...) {
      // Element.getAttribute('href') => Element.href.
      Object.assign(this[TransferrableKeys.propertyBackedAttributes], {
        href: this.href,
      });
    }

    get href(): string {
      return this.url ? this.url.href : '';
    }
    set href(url: string) {
      this.url = new URL(url);
      this.setAttribute('href', this.url.href);
    }
  }
*/
// HTMLAnchorElement.host => string
// HTMLAnchorElement.hostname => string
// HTMLAnchorElement.protocol => string
// HTMLAnchorElement.pathname => string
// HTMLAnchorElement.search => string
// HTMLAnchorElement.hash => string
// HTMLAnchorElement.username => string
// HTMLAnchorElement.password => string
// HTMLAnchorElement.origin => string, readonly (getter no setter)
