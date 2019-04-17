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
import { HTMLFormControlsCollectionMixin } from './HTMLFormControlsMixin';
import { reflectProperties } from './enhanceElement';

export class HTMLFormElement extends HTMLElement {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/length
   * @return number of controls in the form
   */
  get length(): number {
    return (this.elements as Array<Element>).length;
  }
}
registerSubclass('form', HTMLFormElement);
HTMLFormControlsCollectionMixin(HTMLFormElement);

// Reflected properties
// HTMLFormElement.name => string, reflected attribute
// HTMLFormElement.method => string, reflected attribute
// HTMLFormElement.target => string, reflected attribute
// HTMLFormElement.action => string, reflected attribute
// HTMLFormElement.enctype => string, reflected attribute
// HTMLFormElement.acceptCharset => string, reflected attribute
// HTMLFormElement.autocomplete => string, reflected attribute
// HTMLFormElement.autocapitalize => string, reflected attribute
reflectProperties(
  [
    { name: [''] },
    { method: ['get'] },
    { target: [''] },
    { action: [''] },
    { enctype: ['application/x-www-form-urlencoded'] },
    { acceptCharset: ['', /* attr */ 'accept-charset'] },
    { autocomplete: ['on'] },
    { autocapitalize: ['sentences'] },
  ],
  HTMLFormElement,
);

// Unimplemented properties
// HTMLFormElement.encoding => string, reflected attribute
// HTMLFormElement.noValidate => boolean, reflected attribute

/*
Unimplemented, TBD:

Named inputs are added to their owner form instance as properties, and can overwrite native properties
if they share the same name (eg a form with an input named action will have its action property return
that input instead of the form's action HTML attribute).
*/
