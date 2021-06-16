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

export class HTMLEmbedElement extends HTMLElement {}
registerSubclass('embed', HTMLEmbedElement);

// Reflected properties, strings.
// HTMLEmbedElement.height => string, reflected attribute
// HTMLEmbedElement.src => string, reflected attribute
// HTMLEmbedElement.type => string, reflected attribute
// HTMLEmbedElement.width => string, reflected attribute
reflectProperties([{ height: [''] }, { src: [''] }, { type: [''] }, { width: [''] }], HTMLEmbedElement);

// Unimplemented
// HTMLEmbedElement.align => string, not reflected
// HTMLEmbedElement.name => string, not reflected
