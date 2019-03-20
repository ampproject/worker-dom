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

btn.addEventListener('click', async () => {
  const h1 = document.createElement('h1');
  h1.textContent = 'Hello World!'
  document.body.appendChild(h1);

  const boundingClientRect = await h1.getBoundingClientRectAsync();
  h1.textContent = h1.textContent + JSON.stringify(boundingClientRect);

  /*

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');

  // Call all methods on a CanvasRenderingContext2D to verify they run fine
  context.clearRect(1, 2, 3, 4);
  context.fillRect(1, 2, 3, 4);
  context.strokeRect(1, 2, 3, 4);

  context.fillText("hello", 1, 2);
  context.strokeText("hello", 1, 2);
  context.measureText("hello");

  context.lineWidth = 2;
  context.lineCap = "butt";
  context.lineJoin = 'bevel';
  context.miterLimit = 11;
  context.setLineDash([1, 2, 3]);
  console.log(context.getLineDash());
  context.lineDashOffset = 33; 

  context.font = 'bold 48px serif';
  context.textAlign = "center";
  context.textBaseline = "bottom";
  context.direction = "rtl";

  context.fillStyle = 'blue';
  context.strokeStyle = 'red';

  console.log(context.createLinearGradient(0, 0, 10, 10));
  console.log(context.createRadialGradient(0, 0, 5, 10, 10, 15));
  console.log(context.createPattern(new OffscreenCanvas(50, 50), "repeat-y"));
  // creating a pattern did not work with 'img' or 'canvas' elements

  context.shadowBlur = 5;
  context.shadowColor = 'green';
  context.shadowOffsetX = 10;
  context.shadowOffsetY = 10;

  context.beginPath();
  context.moveTo(10, 10);
  context.lineTo(20, 20);
  context.bezierCurveTo(10, 10, 20, 20, 30, 30);
  context.quadraticCurveTo(10, 10, 30, 30);
  context.arc(15, 15, 5, 0, 6);
  context.arcTo(0, 0, 10, 10, 15);
  context.ellipse(0, 0, 5, 5, 6, 0, 22);
  context.rect(10, 10, 5, 5);
  context.closePath();

  const path = new Path2D();

  context.fill(path);
  context.stroke(path);

  context.clip(path, "evenodd");
  console.log(context.isPointInPath(path, 10, 10, "nonzero"));
  console.log(context.isPointInStroke(path, 10, 10));

  context.rotate(10);
  context.scale(2, 2);
  context.translate(10, 10);
  context.transform(1, 2, 3, 4, 5, 6);

  context.setTransform(6, 5, 4, 3, 2, 1);
  context.resetTransform();

  context.globalAlpha = 33;
  context.globalCompositeOperation = "hello";
  
  const imageData = context.createImageData(50, 50);
  console.log(imageData);
  console.log(context.createImageData(imageData));
  context.putImageData(imageData, 100, 100);

  // throws because "source width is 0"
  //console.log(context.getImageData());

  context.imageSmoothingEnabled = false;
  context.imageSmoothingQuality = "high";

  context.save();
  context.restore();

  // undefined for now
  // console.log(context.canvas);

  context.filter = "supercalifragilisticespialidocious";
  */
 const div = document.createElement('div');
 document.appendChild(div);
 div.innerHTML = '<iframe srcdoc=""></iframe>';

});