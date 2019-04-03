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
const doubleCanvasBtn = document.getElementById('doubleCanvasBtn');

existingCanvasBtn.addEventListener('click', async () => {
  // Scenario #1:
  // Canvas is already on the page, retrieve using getElementById
  const canvas = document.getElementById('myCanvas');
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

doubleCanvasBtn.addEventListener('click', async () => {
  // Scenario #3:
  // Two different canvas elements created at the same time.
  // This scenario is needed to make sure async logic works correctly.
  const canvasOne = document.createElement('canvas');
  const canvasTwo = document.createElement('canvas');

  document.body.appendChild(canvasOne);
  document.body.appendChild(canvasTwo);

  const ctxOne = canvasOne.getContext('2d');
  const ctxTwo = canvasTwo.getContext('2d');

  ctxOne.lineWidth = 1;
  ctxOne.strokeRect(7.5, 14.0, 15.0, 11.0);
  ctxOne.fillRect(13.0, 19.0, 4.0, 6.0);
  ctxOne.moveTo(5.0, 14.0);
  ctxOne.lineTo(15.0, 6.0);
  ctxOne.lineTo(25.0, 14.0);
  ctxOne.closePath();
  ctxOne.stroke();

  ctxTwo.lineWidth = 1;
  ctxTwo.strokeRect(7.5, 14.0, 15.0, 11.0);
  ctxTwo.fillRect(13.0, 19.0, 4.0, 6.0);
  ctxTwo.moveTo(5.0, 14.0);
  ctxTwo.lineTo(15.0, 6.0);
  ctxTwo.lineTo(25.0, 14.0);
  ctxTwo.closePath();
  ctxTwo.stroke();
});
