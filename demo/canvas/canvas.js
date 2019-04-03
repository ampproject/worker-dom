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

const existingCanvasBtn = document.getElementById('existingCanvasBtn');
const newCanvasBtn = document.getElementById('newCanvasBtn');

existingCanvasBtn.addEventListener('click', async () => {
    // Scenario #1:
    // Canvas is already on the page, retrieve using getElementById
    const otherCanvas = document.getElementById('myCanvas');
    const ctx = otherCanvas.getContext('2d');

    ctx.lineWidth = 1;
    ctx.strokeRect(7.5, 14.0, 15.0, 11.0);
    ctx.fillRect(13.0, 19.0, 4.0, 6.0);
    ctx.moveTo(5.0, 14.0);
    ctx.lineTo(15.0, 6.0);
    ctx.lineTo(25.0, 14.0);
    ctx.closePath();
    ctx.stroke();
});

newCanvasBtn.addEventListener('click', async () => {
  // Scenario #2:
  // Create a canvas element using document.createElement()
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  ctx.lineWidth = 1;
  ctx.strokeRect(7.5, 14.0, 15.0, 11.0);
  ctx.fillRect(13.0, 19.0, 4.0, 6.0);
  ctx.moveTo(5.0, 14.0);
  ctx.lineTo(15.0, 6.0);
  ctx.lineTo(25.0, 14.0);
  ctx.closePath();
  ctx.stroke();

});