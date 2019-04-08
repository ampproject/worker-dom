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
  const otherCanvas = document.getElementById('myCanvas');
  const ctx = otherCanvas.getContext('2d');

  ctx.lineWidth = 2;
  ctx.strokeRect(15, 28, 30, 22);
  ctx.fillRect(26, 38, 8, 12);
  ctx.moveTo(10, 28);
  ctx.lineTo(30, 12);
  ctx.lineTo(50, 28);
  ctx.closePath();
  ctx.stroke();
});

newCanvasBtn.addEventListener('click', async () => {
  // Scenario #2:
  // Create a canvas element using document.createElement()
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  ctx.lineWidth = 2;
  ctx.strokeRect(15, 28, 30, 22);
  ctx.fillRect(26, 38, 8, 12);
  ctx.moveTo(10, 28);
  ctx.lineTo(30, 12);
  ctx.lineTo(50, 28);
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

  ctxOne.lineWidth = 2;
  ctxOne.strokeRect(15, 28, 30, 22);
  ctxOne.fillRect(26, 38, 8, 12);
  ctxOne.moveTo(10, 28);
  ctxOne.lineTo(30, 12);
  ctxOne.lineTo(50, 28);
  ctxOne.closePath();
  ctxOne.stroke();

  ctxTwo.lineWidth = 2;
  ctxTwo.strokeRect(15, 28, 30, 22);
  ctxTwo.fillRect(26, 38, 8, 12);
  ctxTwo.moveTo(10, 28);
  ctxTwo.lineTo(30, 12);
  ctxTwo.lineTo(50, 28);
  ctxTwo.closePath();
  ctxTwo.stroke();
});
