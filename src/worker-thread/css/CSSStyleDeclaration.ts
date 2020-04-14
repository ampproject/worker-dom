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
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { store as storeString } from '../strings';
import { Document } from '../dom/Document';

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
  const keysToAppend = keys.filter((key) => isNaN(key as any) && !CSSStyleDeclaration.prototype.hasOwnProperty(key));
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

  keysToAppend.forEach((key: string, index: number): void => {
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
  });
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
  private [TransferrableKeys.properties]: StyleProperties = {};
  private [TransferrableKeys.storeAttribute]: (namespaceURI: NamespaceURI, name: string, value: string) => string;
  private [TransferrableKeys.target]: Element;

  constructor(target: Element) {
    this[TransferrableKeys.storeAttribute] = target[TransferrableKeys.storeAttribute].bind(target);
    this[TransferrableKeys.target] = target;
  }

  /**
   * Retrieve the value for a given property key.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/getPropertyValue
   * @param key the name of the property to retrieve the value for.
   * @return value stored for the provided key.
   */
  public getPropertyValue(key: string): string {
    return this[TransferrableKeys.properties][key] || '';
  }

  /**
   * Remove a value for a given property key.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/removeProperty
   * @param key the name of the property to retrieve the value for.
   * @return previously stored value for the provided key.
   */
  public removeProperty(key: string): string {
    const oldValue = this.getPropertyValue(key);

    this[TransferrableKeys.properties][key] = null;
    this.mutated(this.cssText);
    return oldValue;
  }

  /**
   * Stores a given value for the provided key.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty
   * @param key modify this key
   * @param value store this value
   */
  public setProperty(key: string, value: string): void {
    this[TransferrableKeys.properties][key] = value;
    this.mutated(this.cssText);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText
   * @return css text string representing known and valid style declarations.
   */
  get cssText(): string {
    let value: string;
    let returnValue: string = '';
    for (const key in this[TransferrableKeys.properties]) {
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
    // value should have an "unknown" type but get/set can't have different types.
    // https://github.com/Microsoft/TypeScript/issues/2521
    const stringValue = typeof value === 'string' ? value : '';

    this[TransferrableKeys.properties] = {};

    const values = stringValue.split(/[:;]/);
    const length = values.length;
    for (let index = 0; index + 1 < length; index += 2) {
      this[TransferrableKeys.properties][toLower(values[index].trim())] = values[index + 1].trim();
    }
    this.mutated(this.cssText);
  }

  /**
   * Report CSSStyleDeclaration mutations to MutationObserver.
   * @param value value after mutation
   * @private
   * // TODO(KB): Write a test to ensure mutations are fired for CSSStyleDeclaration changes.
   */
  private mutated(value: string): void {
    const oldValue = this[TransferrableKeys.storeAttribute](this[TransferrableKeys.target].namespaceURI, 'style', value);
    mutate(
      this[TransferrableKeys.target].ownerDocument as Document,
      {
        type: MutationRecordType.ATTRIBUTES,
        target: this[TransferrableKeys.target],
        attributeName: 'style',
        value,
        oldValue,
      },
      [
        TransferrableMutationType.ATTRIBUTES,
        this[TransferrableKeys.target][TransferrableKeys.index],
        storeString('style'),
        0, // Attribute Namespace is the default value.
        value !== null ? storeString(value) + 1 : 0,
      ],
    );
  }
}
