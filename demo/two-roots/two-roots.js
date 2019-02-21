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

const btn = document.getElementsByTagName('button')[0];
console.log('QQQQ: ', document.querySelectorAll('button'));

btn.addEventListener('click', async () => {
  const infoEl = document.getElementById('info');
  const boundingClientRect = await infoEl.getBoundingClientRectAsync();
  console.log('QQQ: returned bcr: ', boundingClientRect, JSON.stringify(boundingClientRect));
  infoEl.textContent = JSON.stringify(boundingClientRect);
});
