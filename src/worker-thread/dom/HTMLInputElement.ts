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

import { HTMLElement } from './HTMLElement';
import { HTMLInputLabelsMixin } from './HTMLInputLabelsMixin';
import { reflectProperties } from './enhanceElement';
import { registerSubclass } from './Element';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { store as storeString } from '../strings';
import { Document } from './Document';
import { transfer } from '../MutationTransfer';
import { NumericBoolean } from '../../utils';

export class HTMLInputElement extends HTMLElement {
  // Per spec, some attributes like 'value' and 'checked' change behavior based on dirty flags.
  // Since these flags can only be changed on interaction (outside of worker), we can ignore them here.
  // Tradeoffs: Consequent attribute changes are missing, HTMLFormElement.reset() doesn't work, etc.
  // Alternative: Implement dirty flag checking in worker-dom, which would require listening for
  //     and forwarding interaction events to flag "dirtiness".
  // https://html.spec.whatwg.org/multipage/input.html#common-input-element-apis
  private [TransferrableKeys.value]: string = '';
  private dirtyValue: boolean = false;
  private [TransferrableKeys.checked]: boolean = false;

  // TODO(willchou): There are a few interrelated issues with `value` property.
  //   1. "Dirtiness" caveat above.
  //   2. Duplicate SYNC events. Sent by every event fired from elements with a `value`, plus the default 'change' listener.
  //   3. Duplicate MUTATE events. Caused by stale `value` in worker due to no default 'input' listener (see below).

  get value(): string {
    return !this.dirtyValue ? this.getAttribute('value') || '' : this[TransferrableKeys.value];
  }

  set value(value: string) {
    // Don't early-out if value doesn't appear to have changed.
    // The worker may have a stale value since 'input' events aren't being forwarded.
    this[TransferrableKeys.value] = String(value);
    this.dirtyValue = true;
    transfer(this.ownerDocument as Document, [
      TransferrableMutationType.PROPERTIES,
      this[TransferrableKeys.index],
      storeString('value'),
      NumericBoolean.FALSE,
      storeString(value),
    ]);
  }

  get valueAsDate(): Date | null {
    // Don't use Date constructor or Date.parse() since ISO 8601 (yyyy-mm-dd) parsing is inconsistent.
    const date = this.stringToDate(this.value);
    const invalid = !date || isNaN(date.getTime());
    return invalid ? null : date;
  }

  /** Unlike browsers, does not throw if this input[type] doesn't support dates. */
  set valueAsDate(value: Date | null) {
    if (!(value instanceof Date)) {
      throw new TypeError('The provided value is not a Date.');
    }
    this.value = this.dateToString(value);
  }

  get valueAsNumber(): number {
    if (this.value.length === 0) {
      return NaN;
    }
    return Number(this.value);
  }

  /** Unlike browsers, does not throw if this input[type] doesn't support numbers. */
  set valueAsNumber(value: number) {
    if (typeof value === 'number') {
      this.value = String(value);
    } else {
      this.value = '';
    }
  }

  get checked(): boolean {
    return this[TransferrableKeys.checked];
  }

  set checked(value: boolean) {
    if (this[TransferrableKeys.checked] === value) {
      return;
    }
    this[TransferrableKeys.checked] = !!value;
    transfer(this.ownerDocument as Document, [
      TransferrableMutationType.PROPERTIES,
      this[TransferrableKeys.index],
      storeString('checked'),
      NumericBoolean.TRUE,
      value === true ? NumericBoolean.TRUE : NumericBoolean.FALSE,
    ]);
  }

  /**
   * Returns a date in 'yyyy-mm-dd' format.
   * @param date
   */
  private dateToString(date: Date): string {
    const y = date.getFullYear();
    const m = date.getMonth() + 1; // getMonth() is 0-index.
    const d = date.getDate();
    return `${y}-${m > 9 ? '' : '0'}${m}-${d > 9 ? '' : '0'}${d}`;
  }

  /**
   * Returns a Date from a 'yyyy-mm-dd' format.
   * @param s
   */
  private stringToDate(str: string): Date | null {
    const components = str.split('-');
    if (components.length !== 3) {
      return null;
    }
    const [y, m, d] = components;
    // Month is 0-index.
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  }
}
registerSubclass('input', HTMLInputElement);
HTMLInputLabelsMixin(HTMLInputElement);

// Reflected Properties
// HTMLInputElement.formAction => string, reflected attribute
// HTMLInputElement.formEncType	=> string, reflected attribute
// HTMLInputElement.formMethod => string, reflected attribute
// HTMLInputElement.formTarget => string, reflected attribute
// HTMLInputElement.name => string, reflected attribute
// HTMLInputElement.type => string, reflected attribute
// HTMLInputElement.disabled => boolean, reflected attribute
// HTMLInputElement.autofocus => boolean, reflected attribute
// HTMLInputElement.required => boolean, reflected attribute
// HTMLInputElement.defaultChecked => boolean, reflected attribute ("checked")
// HTMLInputElement.alt => string, reflected attribute
// HTMLInputElement.height => number, reflected attribute
// HTMLInputElement.src => string, reflected attribute
// HTMLInputElement.width => number, reflected attribute
// HTMLInputElement.accept => string, reflected attribute
// HTMLInputElement.autocomplete => string, reflected attribute
// HTMLInputElement.maxLength => number, reflected attribute
// HTMLInputElement.size => number, reflected attribute
// HTMLInputElement.pattern => string, reflected attribute
// HTMLInputElement.placeholder => string, reflected attribute
// HTMLInputElement.readOnly => boolean, reflected attribute
// HTMLInputElement.min => string, reflected attribute
// HTMLInputElement.max => string, reflected attribute
// HTMLInputElement.defaultValue => string, reflected attribute
// HTMLInputElement.dirname => string, reflected attribute
// HTMLInputElement.multiple => boolean, reflected attribute
// HTMLInputElement.step => string, reflected attribute
// HTMLInputElement.autocapitalize => string, reflected attribute
reflectProperties(
  [
    { accept: [''] },
    { alt: [''] },
    { autocapitalize: [''] },
    { autocomplete: [''] },
    { autofocus: [false] },
    { defaultChecked: [false, /* attr */ 'checked'] },
    { defaultValue: ['', /* attr */ 'value'] },
    { dirName: [''] },
    { disabled: [false] },
    { formAction: [''] },
    { formEncType: [''] },
    { formMethod: [''] },
    { formTarget: [''] },
    { height: [0] },
    { max: [''] },
    { maxLength: [0] },
    { min: [''] },
    { multiple: [false] },
    { name: [''] },
    { pattern: [''] },
    { placeholder: [''] },
    { readOnly: [false] },
    { required: [false] },
    { size: [0] },
    { src: [''] },
    { step: [''] },
    { type: ['text'] },
    { width: [0] },
  ],
  HTMLInputElement,
);

// TODO(KB) Not Reflected Properties
// HTMLInputElement.indeterminate => boolean

// Unimplemented Properties
// HTMLInputElement.formNoValidate => string, reflected attribute
// HTMLInputElement.validity => ValidityState, readonly
// HTMLInputElement.validationMessage => string, readonly
// HTMLInputElement.willValidate => boolean, readonly
// HTMLInputElement.allowdirs => boolean
// HTMLInputElement.files	=> Array<File>
// HTMLInputElement.webkitdirectory	=> boolean, reflected attribute
// HTMLInputElement.webkitEntries => Array<FileSystemEntry>
// HTMLInputElement.selectionStart => number
// HTMLInputElement.selectionEnd => number
// HTMLInputElement.selectionDirection => string
// HTMLInputElement.list => Element, read only (element pointed by list attribute)

// Unimplemented Methods
// HTMLInputElement.setSelectionRange()
// HTMLInputElement.setRangeText()
// HTMLInputElement.setCustomValidity()
// HTMLInputElement.checkValidity()
// HTMLInputElement.stepDown()
// HTMLInputElement.stepUp()
