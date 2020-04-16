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

import { Element } from './Element';
import { reflectProperties } from './enhanceElement';
import { matchNearestParent, tagNameConditionPredicate } from './matchElements';
import { TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

export const appendGlobalEventProperties = (keys: Array<string>): void => {
  const keysToAppend = keys.filter((key) => !HTMLElement.prototype.hasOwnProperty(key));
  if (keysToAppend.length <= 0) {
    return;
  }

  keysToAppend.forEach((key: string): void => {
    const normalizedKey = key.replace(/on/, '');
    Object.defineProperty(HTMLElement.prototype, key, {
      enumerable: true,
      get(): string {
        return this[TransferrableKeys.propertyEventHandlers][normalizedKey] || null;
      },
      set(value) {
        const stored = this[TransferrableKeys.propertyEventHandlers][normalizedKey];
        if (stored) {
          this.removeEventListener(normalizedKey, stored);
        }
        this.addEventListener(normalizedKey, value);
        this[TransferrableKeys.propertyEventHandlers][normalizedKey] = value;
      },
    });
  });
};

export class HTMLElement extends Element {
  public [TransferrableKeys.propertyEventHandlers]: {
    [key: string]: Function;
  } = {};
  /**
   * Find the nearest parent form element.
   * Implemented in HTMLElement since so many extensions of HTMLElement repeat this functionality. This is not to spec.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement
   * @return nearest parent form element.
   */
  get form(): Element | null {
    return matchNearestParent(this, tagNameConditionPredicate(['FORM']));
  }

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.HTMLElement, this[TransferrableKeys.index]];
  }
}

// Reflected properties
// HTMLElement.accessKey => string, reflected attribute
// HTMLElement.contentEditable => string, reflected attribute
// HTMLElement.dir => string, reflected attribute
// HTMLElement.lang => string, reflected attribute
// HTMLElement.title => string, reflected attribute
// HTMLElement.draggable => boolean, reflected attribute
// HTMLElement.hidden => boolean, reflected attribute
// HTMLElement.noModule => boolean, reflected attribute
// HTMLElement.spellcheck => boolean, reflected attribute
// HTMLElement.translate => boolean, reflected attribute
reflectProperties(
  [
    { accessKey: [''] },
    { contentEditable: ['inherit'] },
    { dir: [''] },
    { lang: [''] },
    { title: [''] },
    {
      draggable: [false, /* attr */ undefined, /* keywords */ ['true', 'false']],
    },
    { hidden: [false, /* attr */ undefined] },
    { noModule: [false] }, // TOOD: Why is this on HTMLElement and not HTMLScriptElement?
    {
      spellcheck: [true, /* attr */ undefined, /* keywords */ ['true', 'false']],
    },
    { translate: [true, /* attr */ undefined, /* keywords */ ['yes', 'no']] },
  ],
  HTMLElement,
);

// Properties
// HTMLElement.accessKeyLabel => string, readonly value of "accessKey"
// HTMLElement.isContentEditable => boolean, readonly value of contentEditable
// HTMLElement.nonce => string, NOT REFLECTED
// HTMLElement.tabIndex => number, reflected attribute

// Layout Properties (TBD)
// HTMLElement.offsetHeight => double, readonly
// HTMLElement.offsetLeft => double, readonly
// HTMLElement.offsetParent => Element
// HTMLElement.offsetTop => double, readonly
// HTMLElement.offsetWidth => double, readonly

// Unimplemented Properties
// HTMLElement.contextMenu => HTMLElement
// HTMLElement.dataset => Map<string (get/set), string>
// HTMLElement.dropzone => DOMSettableTokenList (DOMTokenList)
// HTMLElement.inert => boolean, reflected
// HTMLElement.itemScope => boolean
// HTMLElement.itemType => DOMSettableTokenList (DOMTokenList)
// HTMLElement.itemId => string
// HTMLElement.itemRef => DOMSettableTokenList (DOMTokenList)
// HTMLElement.itemProp => DOMSettableTokenList (DOMTokenList)
// HTMLElement.itemValue => object
// HTMLElement.properties => HTMLPropertiesCollection, readonly
