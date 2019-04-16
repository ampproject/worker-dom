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

const myCanvas = document.getElementById('myCanvas');
const myCtx = myCanvas.getContext('2d');

function draw(e) {
  myCtx.lineTo(e.offsetX, e.offsetY);
  myCtx.stroke();
}

myCanvas.addEventListener('mousedown', e => {
  myCtx.strokeStyle = 'red';
  myCtx.lineWidth = 2;
  myCtx.setLineDash([10, 10]);
  myCtx.beginPath();
  myCtx.moveTo(e.offsetX, e.offsetY);
  myCanvas.addEventListener('mousemove', draw);
});

myCanvas.addEventListener('mouseup', e => {
  myCanvas.removeEventListener('mousemove', draw);
});

existingCanvasBtn.addEventListener('click', async () => {
  // Scenario #1:
  // Canvas is already on the page
  myCtx.fillStyle = 'blue';
  myCtx.strokeStyle = 'blue';
  myCtx.lineWidth = 5;
  myCtx.setLineDash([1, 0]);
  myCtx.beginPath();
  myCtx.strokeRect(212.5, 222.5, 75, 55);
  myCtx.fillRect(240, 247.5, 20, 30);
  myCtx.moveTo(200, 222.5);
  myCtx.lineTo(250, 182.5);
  myCtx.lineTo(300, 222.5);
  myCtx.closePath();
  myCtx.stroke();

});

newCanvasBtn.addEventListener('click', async () => {
  // Scenario #2:
  // Create a canvas element using document.createElement()
  const canvas = document.createElement('canvas');
  const newCanvasDiv = document.getElementById('newCanvasDiv');
  canvas.width = 250;
  canvas.height = 250;
  newCanvasDiv.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  ctx.lineWidth = 5;
  ctx.fillStyle = 'orange';
  ctx.strokeStyle = 'orange';
  ctx.strokeRect(87.5, 97.5, 75, 55);
  ctx.fillRect(115, 122.5, 20, 30);
  ctx.moveTo(75, 97.5);
  ctx.lineTo(125, 57.5);
  ctx.lineTo(175, 97.5);

  ctx.closePath();
  ctx.stroke();
});

doubleCanvasBtn.addEventListener('click', async () => {
  // Scenario #3:
  // Two different canvas elements created at the same time.
  // This scenario is needed to make sure async logic works correctly.
  const canvasOne = document.createElement('canvas');
  const canvasTwo = document.createElement('canvas');

  canvasOne.width = 250;
  canvasOne.height = 250;
  canvasTwo.width = 250;
  canvasTwo.height = 250;

  const newCanvasDiv = document.getElementById('newCanvasDiv');

  newCanvasDiv.appendChild(canvasOne);
  newCanvasDiv.appendChild(canvasTwo);


  const ctxOne = canvasOne.getContext('2d');
  const ctxTwo = canvasTwo.getContext('2d');

  ctxOne.lineWidth = 5;
  ctxOne.fillStyle = 'red';
  ctxOne.strokeStyle = 'red';
  ctxOne.strokeRect(87.5, 97.5, 75, 55);
  ctxOne.fillRect(115, 122.5, 20, 30);
  ctxOne.moveTo(75, 97.5);
  ctxOne.lineTo(125, 57.5);
  ctxOne.lineTo(175, 97.5);
  ctxOne.closePath();
  ctxOne.stroke();

  ctxTwo.lineWidth = 5;
  ctxTwo.fillStyle = 'green';
  ctxTwo.strokeStyle = 'green';
  ctxTwo.strokeRect(87.5, 97.5, 75, 55);
  ctxTwo.fillRect(115, 122.5, 20, 30);
  ctxTwo.moveTo(75, 97.5);
  ctxTwo.lineTo(125, 57.5);
  ctxTwo.lineTo(175, 97.5);

  ctxTwo.closePath();
  ctxTwo.stroke();
});
