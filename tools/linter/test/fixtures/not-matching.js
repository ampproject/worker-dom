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

// String literal.
'pageXOffset';
// Implicit global assignment, not read.
pageXOffset = x;
// Unrelated object declaration.
x = { pageXOffset: 1 };
// Unrelated property read.
offsetWidth.other;
// Unrelated method call.
getBoundingClientRect.other();
// Unrelated property read.
btn.other;
// Unrelated property read by key.
btn['other'];
// Unrelated property array access.
btn[1];
function one(pageXOffset) {
  // Local shadow for an implicit global.
  pageXOffset;
}
function two(getComputedStyle) {
  // Local shadow for an implicit global.
  getComputedStyle();
}
function three(other) {
  // Local shadow for an implicit global.
  var pageXOffset = other;
  pageXOffset;
}
function four(offsetWidth) {
  // A computed property access.
  btn[offsetWidth];
}
function five(btn, offsetWidth) {
  var { [offsetWidth]: x } = btn;
}
