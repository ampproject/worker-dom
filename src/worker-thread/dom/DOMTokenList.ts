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
import { NamespaceURI } from './Node';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';

export class DOMTokenList {
  private array_: Array<string> = [];
  private element_: Element;
  private attributeName_: string;
  private storeAttributeMethod_: (namespaceURI: NamespaceURI, name: string, value: string) => void;

  /**
   * The DOMTokenList interface represents a set of space-separated tokens.
   * It is indexed beginning with 0 as with JavaScript Array objects and is case-sensitive.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
   * @param defineOn Element or class extension to define getter/setter pair for token list access.
   * @param element Specific Element instance to modify when value is changed.
   * @param attributeName Name of the attribute used by Element to access DOMTokenList.
   * @param accessorKey Key used to access DOMTokenList directly from specific element.
   * @param propertyName Key used to access DOMTokenList as string getter/setter.
   */
  constructor(defineOn: typeof Element, element: Element, attributeName: string, accessorKey: string | null, propertyName: string | null) {
    this.element_ = element;
    this.attributeName_ = attributeName;

    this.storeAttributeMethod_ = element.storeAttributeNS_.bind(element);
    element.propertyBackedAttributes_[attributeName] = [(): string | null => this.value, (value: string) => (this.value = value)];

    if (accessorKey && propertyName) {
      Object.defineProperty(defineOn.prototype, propertyName, {
        enumerable: true,
        configurable: true,
        get(): string {
          return (this as Element)[accessorKey].value;
        },
        set(value: string) {
          (this as Element)[accessorKey].value = value;
        },
      });
    }
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value
   * @return string representation of tokens (space delimitted).
   */
  get value(): string {
    return this.array_.join(' ');
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/length
   * @return integer representing the number of objects stored in the object.
   */
  get length(): number {
    return this.array_.length;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value
   * @param collection String of values space delimited to replace the current DOMTokenList with.
   */
  set value(collection: string) {
    const oldValue = this.value;
    const newValue = collection.trim();

    // Replace current tokens with new tokens.
    this.array_.splice(0, this.array_.length, ...(newValue !== '' ? newValue.split(/\s+/) : ''));
    this.mutationCompleteHandler_(oldValue, newValue);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item
   * @param index number from DOMTokenList entities to retrieve value of
   * @return value stored at the index requested, or undefined if beyond known range.
   */
  public item(index: number): string | undefined {
    return this.array_[index];
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains
   * @param token value the DOMTokenList is tested for.
   * @return boolean indicating if the token is contained by the DOMTokenList.
   */
  public contains(token: string): boolean {
    return this.array_.includes(token);
  }

  /**
   * Add a token or tokens to the list.
   * Note: All duplicates are removed, and the first token's position with the value is preserved.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add
   * @param tokens each token is a string to add to a TokenList.
   */
  public add(...tokens: string[]): void {
    const oldValue = this.value;
    this.array_.splice(0, this.array_.length, ...new Set(this.array_.concat(tokens)));
    this.mutationCompleteHandler_(oldValue, this.value);
  }

  /**
   * Remove a token or tokens from the list.
   * Note: All duplicates are removed, and the first token's position with the value is preserved.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove
   * @param tokens each token is a string to remove from a TokenList.
   */
  public remove(...tokens: string[]): void {
    const oldValue = this.value;
    this.array_.splice(0, this.array_.length, ...new Set(this.array_.filter(token => !tokens.includes(token))));
    this.mutationCompleteHandler_(oldValue, this.value);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace
   * @param token
   * @param newToken
   */
  public replace(token: string, newToken: string): void {
    if (!this.array_.includes(token)) {
      return;
    }

    const oldValue = this.value;
    const set = new Set(this.array_);
    if (token !== newToken) {
      set.delete(token);
      if (newToken !== '') {
        set.add(newToken);
      }
    }
    this.array_.splice(0, this.array_.length, ...set);
    this.mutationCompleteHandler_(oldValue, this.value);
  }

  /**
   * Adds or removes a token based on its presence in the token list.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle
   * @param token string to add or remove from the token list
   * @param force changes toggle into a one way-only operation. true => token added. false => token removed.
   * @return true if the token is in the list following mutation, false if not.
   */
  public toggle(token: string, force?: boolean): boolean {
    if (!this.array_.includes(token)) {
      if (force !== false) {
        // Note, this will add the token if force is undefined (not passed into the method), or true.
        this.add(token);
      }
      return true;
    } else if (force !== true) {
      // Note, this will remove the token if force is undefined (not passed into the method), or false.
      this.remove(token);
      return false;
    }

    return true;
  }

  /**
   * Report tokenList mutations to MutationObserver.
   * @param oldValue value before mutation
   * @param value value after mutation
   * @private
   */
  private mutationCompleteHandler_(oldValue: string, value: string): void {
    this.storeAttributeMethod_(null, this.attributeName_, value);
    mutate({
      type: MutationRecordType.ATTRIBUTES,
      target: this.element_,
      attributeName: this.attributeName_,
      value,
      oldValue,
    });
  }
}
