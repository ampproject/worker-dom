/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

/**
 * @const {
 *   [key: string]: {
 *     global?: boolean,
 *     replacement?: string,
 *   }
 * }
 */
module.exports = {
  clientHeight: {},
  clientLeft: {},
  clientTop: {},
  clientWidth: {},
  computedName: {},
  computedRole: {},
  getBoundingClientRect: {
    replacement: 'getBoundingClientRectAsync()',
  },
  getClientRects: {},
  getComputedAccessibleNode: { global: true },
  getComputedStyle: { global: true },
  getSelection: { global: true },
  innerHeight: { global: true },
  innerWidth: { global: true },
  offsetHeight: {},
  offsetLeft: {},
  offsetParent: {},
  offsetTop: {},
  offsetWidth: {},
  outerHeight: { global: true },
  outerWidth: { global: true },
  pageXOffset: { global: true },
  pageYOffset: { global: true },
  screenLeft: { global: true },
  screenTop: { global: true },
  screenX: { global: true },
  screenY: { global: true },
  scrollHeight: {},
  scrollLeft: {},
  scrollTop: {},
  scrollWidth: {},
  scrollX: { global: true },
  scrollY: { global: true },
  scrollingElement: {},
};
