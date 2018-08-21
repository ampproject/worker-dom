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
import { HTMLInputLabelsMixin } from './HTMLInputLabelsMixin';

export class HTMLInputElement extends HTMLElement {}
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
    { formAction: [''] },
    { formEncType: [''] },
    { formMethod: [''] },
    { formTarget: [''] },
    { name: [''] },
    { type: ['text'] },
    { disabled: [false] },
    { autofocus: [false] },
    { required: [false] },
    { defaultChecked: [false, 'checked'] },
    { alt: [''] },
    { height: [0] },
    { src: [''] },
    { width: [0] },
    { accept: [''] },
    { autocomplete: [''] },
    { maxLength: [0] },
    { size: [0] },
    { pattern: [''] },
    { placeholder: [''] },
    { readOnly: [false] },
    { min: [''] },
    { max: [''] },
    { defaultValue: ['', 'value'] },
    { dirName: [''] },
    { multiple: [false] },
    { step: [''] },
    { autocapitalize: [''] },
  ],
  HTMLInputElement,
);

// TODO(KB) Not Reflected Properties
// HTMLInputElement.value => string
// HTMLInputElement.checked	=> boolean
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
// HTMLInputElement.valueAsDate => Date
// HTMLInputElement.valueAsNumber => number

// Unimplemented Methods
// HTMLInputElement.setSelectionRange()
// HTMLInputElement.setRangeText()
// HTMLInputElement.setCustomValidity()
// HTMLInputElement.checkValidity()
// HTMLInputElement.stepDown()
// HTMLInputElement.stepUp()
