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

import { registerSubclass } from './Element';
import { HTMLElement } from './HTMLElement';
import { reflectProperties } from './enhanceElement';

export class HTMLScriptElement extends HTMLElement {
  /**
   * A Synonym for the Node.textContent property getter.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
   * @return value of text node direct child of this Element.
   */
  get text(): string {
    return this.textContent;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
   * @param text new text content to store for this Element.
   */
  set text(text: string) {
    this.textContent = text;
  }
}
registerSubclass('script', HTMLScriptElement);

// Reflected Properties
// HTMLScriptElement.type => string, reflected attribute
// HTMLScriptElement.src => string, reflected attribute
// HTMLScriptElement.charset => string, reflected attribute
// HTMLScriptElement.async => boolean, reflected attribute
// HTMLScriptElement.defer => boolean, reflected attribute
// HTMLScriptElement.crossOrigin => string, reflected attribute
// HTMLScriptElement.noModule => boolean, reflected attribute
reflectProperties(
  [{ type: [''] }, { src: [''] }, { charset: [''] }, { async: [false] }, { defer: [false] }, { crossOrigin: [''] }, { noModule: [false] }],
  HTMLScriptElement,
);
