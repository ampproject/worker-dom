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

export class HTMLImageElement extends HTMLElement {}
registerSubclass('img', HTMLImageElement);

// Reflected Properties
// HTMLImageElement.alt => string, reflected attribute
// HTMLImageElement.crossOrigin => string, reflected attribute
// HTMLImageElement.height => number, reflected attribute
// HTMLImageElement.isMap => boolean, reflected attribute
// HTMLImageElement.referrerPolicy => string, reflected attribute
// HTMLImageElement.src => string, reflected attribute
// HTMLImageElement.sizes => string, reflected attribute
// HTMLImageElement.srcset => string, reflected attribute
// HTMLImageElement.useMap => string, reflected attribute
// HTMLImageElement.width => number, reflected attribute
reflectProperties(
  [
    { alt: [''] },
    { crossOrigin: [''] },
    { height: [0] },
    { isMap: [false] },
    { referrerPolicy: [''] },
    { src: [''] },
    { sizes: [''] },
    { srcset: [''] },
    { useMap: [''] },
    { width: [0] },
  ],
  HTMLImageElement,
);

// Unimplmented Properties
// HTMLImageElement.complete Read only
// Returns a Boolean that is true if the browser has finished fetching the image, whether successful or not. It also shows true, if the image has no src value.
// HTMLImageElement.currentSrc Read only
// Returns a DOMString representing the URL to the currently displayed image (which may change, for example in response to media queries).
// HTMLImageElement.naturalHeight Read only
// Returns a unsigned long representing the intrinsic height of the image in CSS pixels, if it is available; else, it shows 0.
// HTMLImageElement.naturalWidth Read only
// Returns a unsigned long representing the intrinsic width of the image in CSS pixels, if it is available; otherwise, it will show 0.
