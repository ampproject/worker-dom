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
import { DOMTokenList } from './DOMTokenList';

export class HTMLIFrameElement extends HTMLElement {
  private _sandbox: DOMTokenList;

  // HTMLIFrameElement.sandbox, DOMTokenList, reflected attribute
  public get sandbox(): DOMTokenList {
    return this._sandbox || (this._sandbox = new DOMTokenList(this, 'sandbox'));
  }
}
registerSubclass('iframe', HTMLIFrameElement);
definePropertyBackedAttributes(HTMLIFrameElement, {
  sandbox: [(el): string | null => el.sandbox.value, (el, value: string) => (el.sandbox.value = value)],
});
// Reflected properties
// HTMLIFrameElement.allow => string, reflected attribute
// HTMLIFrameElement.allowFullscreen => boolean, reflected attribute
// HTMLIFrameElement.csp => string, reflected attribute
// HTMLIFrameElement.height => string, reflected attribute
// HTMLIFrameElement.name => string, reflected attribute
// HTMLIFrameElement.referrerPolicy => string, reflected attribute
// HTMLIFrameElement.src => string, reflected attribute
// HTMLIFrameElement.srcdoc => string, reflected attribute
// HTMLIFrameElement.width => string, reflected attribute
reflectProperties(
  [
    { allow: [''] },
    { allowFullscreen: [false] },
    { csp: [''] },
    { height: [''] },
    { name: [''] },
    { referrerPolicy: [''] },
    { src: [''] },
    { srcdoc: [''] },
    { width: [''] },
  ],
  HTMLIFrameElement,
);

// Unimplemented Properties
// HTMLIFrameElement.allowPaymentRequest => boolean, reflected attribute
// HTMLIFrameElement.contentDocument => Document, read only (active document in the inline frame's nested browsing context)
// HTMLIFrameElement.contentWindow => WindowProxy, read only (window proxy for the nested browsing context)
