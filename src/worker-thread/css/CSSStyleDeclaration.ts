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

import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { Element } from '../dom/Element';
import { NamespaceURI } from '../dom/Node';
import { toLower } from '../../utils';

interface StyleProperties {
  [key: string]: string | null;
}
interface StyleDeclaration {
  getPropertyValue: (key: string) => string;
  removeProperty: (key: string) => void;
  setProperty: (key: string, value: string) => void;
  cssText: string;
  [key: string]:
    | string
    | number
    | StyleProperties
    | ((key: string) => string)
    | ((key: string) => void)
    | ((key: string, value: string) => void)
    | ((namespaceURI: NamespaceURI, name: string, value: string) => void);
}

const hyphenateKey = (key: string): string => toLower(key.replace(/(webkit|ms|moz|khtml)/g, '-$1').replace(/([a-zA-Z])(?=[A-Z])/g, '$1-'));

export const appendKeys = (keys: Array<string>): void => {
  const keysToAppend = keys.filter(key => !CSSStyleDeclaration.prototype.hasOwnProperty(key));
  if (keysToAppend.length <= 0) {
    return;
  }

  const previousPrototypeLength = (CSSStyleDeclaration.prototype.length || 0) as number;
  if (previousPrototypeLength !== 0) {
    CSSStyleDeclaration.prototype.length = previousPrototypeLength + keysToAppend.length;
  } else {
    Object.defineProperty(CSSStyleDeclaration.prototype, 'length', {
      configurable: true,
      writable: true,
      value: keysToAppend.length,
    });
  }

  keysToAppend.forEach(
    (key: string, index: number): void => {
      const hyphenatedKey = hyphenateKey(key);
      CSSStyleDeclaration.prototype[index + previousPrototypeLength] = hyphenatedKey;

      Object.defineProperties(CSSStyleDeclaration.prototype, {
        [key]: {
          get(): string {
            return this.getPropertyValue(hyphenatedKey);
          },
          set(value) {
            this.setProperty(hyphenatedKey, value);
          },
        },
      });
    },
  );
};

export class CSSStyleDeclaration implements StyleDeclaration {
  [key: string]:
    | string
    | number
    | StyleProperties
    | ((key: string) => string)
    | ((key: string) => void)
    | ((key: string, value: string) => void)
    | ((namespaceURI: NamespaceURI, name: string, value: string) => void);
  private properties_: StyleProperties = {};
  private storeAttributeMethod_: (namespaceURI: NamespaceURI, name: string, value: string) => string;
  private element_: Element;

  constructor(element: Element) {
    this.storeAttributeMethod_ = element.storeAttributeNS_.bind(element);
    this.element_ = element;

    if (element && element.propertyBackedAttributes_) {
      element.propertyBackedAttributes_.style = [(): string | null => this.cssText, (value: string) => (this.cssText = value)];
    }
  }

  /**
   * Retrieve the value for a given property key.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/getPropertyValue
   * @param key the name of the property to retrieve the value for.
   * @return value stored for the provided key.
   */
  public getPropertyValue(key: string): string {
    return this.properties_[key] || '';
  }

  /**
   * Remove a value for a given property key.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/removeProperty
   * @param key the name of the property to retrieve the value for.
   * @return previously stored value for the provided key.
   */
  public removeProperty(key: string): string {
    const oldValue = this.getPropertyValue(key);

    this.properties_[key] = null;
    this.mutationCompleteHandler_(this.cssText);
    return oldValue;
  }

  /**
   * Stores a given value for the provided key.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty
   * @param key modify this key
   * @param value store this value
   */
  public setProperty(key: string, value: string): void {
    this.properties_[key] = value;
    this.mutationCompleteHandler_(this.cssText);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText
   * @return css text string representing known and valid style declarations.
   */
  get cssText(): string {
    let value: string;
    let returnValue: string = '';
    for (let key in this.properties_) {
      if ((value = this.getPropertyValue(key)) !== '') {
        returnValue += `${key}: ${value}; `;
      }
    }
    return returnValue.trim();
  }

  /**
   * Replace all style declarations with new values parsed from a cssText string.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText
   * @param value css text string to parse and store
   */
  set cssText(value: string) {
    this.properties_ = {};

    const values = value.split(/[:;]/);
    const length = values.length;
    for (let index = 0; index + 1 < length; index += 2) {
      this.properties_[toLower(values[index].trim())] = values[index + 1].trim();
    }
    this.mutationCompleteHandler_(this.cssText);
  }

  /**
   * Report CSSStyleDeclaration mutations to MutationObserver.
   * @param value value after mutation
   * @private
   */
  private mutationCompleteHandler_(value: string): void {
    const oldValue = this.storeAttributeMethod_(null, 'style', value);
    mutate({
      type: MutationRecordType.ATTRIBUTES,
      target: this.element_,
      attributeName: 'style',
      value,
      oldValue,
    });
  }
}
