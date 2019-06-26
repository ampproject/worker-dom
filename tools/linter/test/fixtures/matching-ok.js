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

// Implicit global reference.
/*OK*/ pageXOffset;
// Implicit global reference.
x = /*OK*/ pageXOffset;
// Implicit global reference.
x = /*OK*/ pageXOffset + 10;
// Implicit global reference.
x(/*OK*/ pageXOffset);
// Explicit global reference.
window./*OK*/ pageXOffset;
// Property getter.
btn./*OK*/ offsetWidth;
// Property getter by key.
btn[/*OK*/ 'offsetWidth'];
// Property getter by key.
btn /*OK*/['offsetWidth'];
// Method call.
bth./*OK*/ getBoundingClientRect();
// Method call by key.
bth[/*OK*/ 'getBoundingClientRect']();
// Method call by key.
bth /*OK*/['getBoundingClientRect']();
// Implicit global method call.
/*OK*/ getComputedStyle();
// Implicit global method call.
/*OK*/ getComputedStyle(btn);
// Explicit global method call.
window./*OK*/ getComputedStyle(btn);
// Implicit global reference.
if (/*OK*/ pageXOffset) {
}
function one(btn) {
  // Property access via object destructuring.
  var { /*OK*/ offsetWidth } = btn;
  offsetWidth;
}
function two(btn) {
  // Property access via object destructuring.
  var { /*OK*/ offsetWidth: x } = btn;
}
