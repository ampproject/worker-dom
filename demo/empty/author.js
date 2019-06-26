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

// <div>Hello World!<span>spaner</span><input /></div>
const span = document.createElement('span');
const div = document.createElement('div');
const input = document.createElement('input');

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

div.appendChild(document.createTextNode('Hello Originally Empty World!'));
span.appendChild(document.createTextNode('spaner'));
div.appendChild(span);
div.appendChild(input);
document.body.appendChild(div);

div.addEventListener('touchmove', e => console.log('touchmove event', e, e.touches.item(0), e.touches.item(1)));
