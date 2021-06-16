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
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { store as storeString } from '../strings';
import { Document } from './Document';

const WHITESPACE_REGEX = /\s/;

/**
 * Synchronizes the string getter/setter with the actual DOMTokenList instance.
 * @param defineOn Element or class extension to define getter/setter pair for token list access.
 * @param accessorKey Key used to access DOMTokenList directly from specific element.
 * @param propertyName Key used to access DOMTokenList as string getter/setter.
 */
export function synchronizedAccessor(defineOn: typeof Element, accessorKey: string, propertyName: string) {
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

export class DOMTokenList {
  private [TransferrableKeys.tokens]: Array<string> = [];
  private [TransferrableKeys.target]: Element;
  private [TransferrableKeys.attributeName]: string;
  private [TransferrableKeys.storeAttribute]: (namespaceURI: NamespaceURI, name: string, value: string) => void;

  /**
   * The DOMTokenList interface represents a set of space-separated tokens.
   * It is indexed beginning with 0 as with JavaScript Array objects and is case-sensitive.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
   * @param target Specific Element instance to modify when value is changed.
   * @param attributeName Name of the attribute used by Element to access DOMTokenList.
   */
  constructor(target: Element, attributeName: string) {
    this[TransferrableKeys.target] = target;
    this[TransferrableKeys.attributeName] = attributeName;
    this[TransferrableKeys.storeAttribute] = target[TransferrableKeys.storeAttribute].bind(target);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value
   * @return string representation of tokens (space delimitted).
   */
  get value(): string {
    return this[TransferrableKeys.tokens].join(' ');
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/length
   * @return integer representing the number of objects stored in the object.
   */
  get length(): number {
    return this[TransferrableKeys.tokens].length;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value
   * @param collection String of values space delimited to replace the current DOMTokenList with.
   */
  set value(collection: string) {
    const oldValue = this.value;
    const newValue = collection.trim();

    // Replace current tokens with new tokens.
    this[TransferrableKeys.tokens].splice(0, this[TransferrableKeys.tokens].length, ...(newValue !== '' ? newValue.split(/\s+/) : ''));
    this[TransferrableKeys.mutated](oldValue, newValue);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item
   * @param index number from DOMTokenList entities to retrieve value of
   * @return value stored at the index requested, or undefined if beyond known range.
   */
  public item(index: number): string | undefined {
    return this[TransferrableKeys.tokens][index];
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains
   * @param token value the DOMTokenList is tested for.
   * @return boolean indicating if the token is contained by the DOMTokenList.
   */
  public contains(token: string): boolean {
    return this[TransferrableKeys.tokens].includes(token);
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
    this[TransferrableKeys.tokens].splice(0, this[TransferrableKeys.tokens].length, ...new Set(this[TransferrableKeys.tokens].concat(tokens)));
    this[TransferrableKeys.mutated](oldValue, this.value);
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
    this[TransferrableKeys.tokens].splice(
      0,
      this[TransferrableKeys.tokens].length,
      ...new Set(this[TransferrableKeys.tokens].filter((token) => !tokens.includes(token))),
    );
    this[TransferrableKeys.mutated](oldValue, this.value);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace
   * @param token
   * @param newToken
   */
  public replace(token: string, newToken: string): void {
    if (!this[TransferrableKeys.tokens].includes(token)) {
      return;
    }

    const oldValue = this.value;
    const set = new Set(this[TransferrableKeys.tokens]);
    if (token !== newToken) {
      set.delete(token);
      if (newToken !== '') {
        set.add(newToken);
      }
    }
    this[TransferrableKeys.tokens].splice(0, this[TransferrableKeys.tokens].length, ...set);
    this[TransferrableKeys.mutated](oldValue, this.value);
  }

  /**
   * Adds or removes a token based on its presence in the token list.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle
   * @param token string to add or remove from the token list
   * @param force changes toggle into a one way-only operation. true => token added. false => token removed.
   * @return true if the token is in the list following mutation, false if not.
   */
  public toggle(token: string, force?: any): boolean {
    if (WHITESPACE_REGEX.test(token)) {
      throw new TypeError('Uncaught DOMException');
    }

    if (!this[TransferrableKeys.tokens].includes(token)) {
      if (force === undefined || !!force) {
        // Note, this will add the token if force is undefined (not passed into the method), or truthy.
        this.add(token);
      }
      return true;
    } else if (!force) {
      // Note, this will remove the token if force is undefined (not passed into the method), or falsey.
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
  private [TransferrableKeys.mutated](oldValue: string, value: string): void {
    this[TransferrableKeys.storeAttribute](this[TransferrableKeys.target].namespaceURI, this[TransferrableKeys.attributeName], value);
    mutate(
      this[TransferrableKeys.target].ownerDocument as Document,
      {
        type: MutationRecordType.ATTRIBUTES,
        target: this[TransferrableKeys.target],
        attributeName: this[TransferrableKeys.attributeName],
        value,
        oldValue,
      },
      [
        TransferrableMutationType.ATTRIBUTES,
        this[TransferrableKeys.target][TransferrableKeys.index],
        storeString(this[TransferrableKeys.attributeName]),
        0, // Attribute Namespace is the default value.
        value !== null ? storeString(value) + 1 : 0,
      ],
    );
  }
}
