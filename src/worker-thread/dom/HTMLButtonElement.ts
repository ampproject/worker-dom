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

export class HTMLButtonElement extends HTMLElement {}
registerSubclass('button', HTMLButtonElement);

// Reflected properties, strings.
// HTMLButtonElement.formAction => string, reflected attribute
// HTMLButtonElement.formEnctype => string, reflected attribute
// HTMLButtonElement.formMethod => string, reflected attribute
// HTMLButtonElement.formTarget => string, reflected attribute
// HTMLButtonElement.name => string, reflected attribute
// HTMLButtonElement.type => string, reflected attribute (default submit)
// HTMLButtonElement.value => string, reflected attribute
// HTMLButtonElement.autofocus => boolean, reflected attribute
// HTMLButtonElement.disabled => boolean, reflected attribute
reflectProperties(
  [
    { formAction: [''] },
    { formEnctype: [''] },
    { formMethod: [''] },
    { formTarget: [''] },
    { name: [''] },
    { type: ['submit'] },
    { value: [''] },
    { autofocus: [false] },
    { disabled: [false] },
  ],
  HTMLButtonElement,
);

// Not reflected
// HTMLButtonElement.formNoValidate => boolean
// HTMLButtonElement.validity => ValidityState, readonly

// Unimplemented
// HTMLButtonElement.form => HTMLFormElement | null, readonly
// HTMLButtonElement.labels => Array<HTMLLabelElement>, readonly
// HTMLButtonElement.menu => HTMLMenuElement
// HTMLButtonElement.willValidate => boolean, readonly
// HTMLButtonElement.validationMessage => string, readonly
