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

const span = document.querySelector('span');
const div = document.querySelector('div');
const input = document.querySelector('input');

input.value = '';

function toggle() {
  span.classList.toggle('clicked');
  div.style.color = div.style.color === 'green' ? 'red' : 'green';
}

span.addEventListener('click', toggle, false);

input.addEventListener(
  'input',
  event => {
    if (/change/.test(event.currentTarget.value)) {
      toggle();
    } else if (/remove/.test(event.currentTarget.value)) {
      span.remove();
    }
  },
  false,
);
