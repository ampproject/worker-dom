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

import { CanvasRenderingContext2D, CanvasFillRule, CanvasImageSource, CanvasGradient, CanvasPattern } from './CanvasTypes';
import { MessageType, OffscreenCanvasToWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { transfer } from '../MutationTransfer';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { OffscreenCanvasPolyfill } from './OffscreenCanvasPolyfill';
import { Document } from '../dom/Document';
import { HTMLElement } from '../dom/HTMLElement';

export const deferredUpgrades = new WeakMap();

export class CanvasRenderingContext2DShim<ElementType extends HTMLElement> {
  private queue = [] as { fnName: string; args: any[]; isSetter: boolean }[];
  public [TransferrableKeys.implementation]: CanvasRenderingContext2D;
  private upgraded = false;
  private canvasElement: ElementType;

  // TODO: This should only exist in testing environment
  public goodOffscreenPromise: Promise<void>;

  constructor(canvas: ElementType) {
    this.canvasElement = canvas;
    const OffscreenCanvas = canvas.ownerDocument.defaultView.OffscreenCanvas;

    if (typeof OffscreenCanvas === 'undefined') {
      this[TransferrableKeys.implementation] = new OffscreenCanvasPolyfill<ElementType>(canvas).getContext('2d');
      this.upgraded = true;
    } else {
      this[TransferrableKeys.implementation] = new OffscreenCanvas(0, 0).getContext('2d');
      this.goodOffscreenPromise = this.getOffscreenCanvasAsync(this.canvasElement).then(instance => {
        this[TransferrableKeys.implementation] = instance.getContext('2d');
        this.upgraded = true;
        this.flushQueue();
      });
    }
  }

  private getOffscreenCanvasAsync(canvas: ElementType): Promise<{ getContext(c: '2d'): CanvasRenderingContext2D }> {
    return new Promise((resolve, reject) => {
      const messageHandler = ({ data }: { data: OffscreenCanvasToWorker }) => {
        if (
          data[TransferrableKeys.type] === MessageType.OFFSCREEN_CANVAS_INSTANCE &&
          data[TransferrableKeys.target][0] === canvas[TransferrableKeys.index]
        ) {
          removeEventListener('message', messageHandler);
          const transferredOffscreenCanvas = (data as OffscreenCanvasToWorker)[TransferrableKeys.data];
          resolve(transferredOffscreenCanvas as { getContext(c: '2d'): CanvasRenderingContext2D });
        }
      };

      // TODO: This should only happen in test environemnet. Otherwise, we should throw.
      if (typeof addEventListener !== 'function') {
        deferredUpgrades.set(canvas, { resolve, reject });
      } else {
        addEventListener('message', messageHandler);
        transfer(canvas.ownerDocument as Document, [TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE, canvas[TransferrableKeys.index]]);
      }
    });
  }

  private flushQueue() {
    for (const call of this.queue) {
      if (call.isSetter) {
        (this[TransferrableKeys.implementation] as any)[call.fnName] = call.args[0];
      } else {
        (this[TransferrableKeys.implementation] as any)[call.fnName](...call.args);
      }
    }
    this.queue.length = 0;
  }

  private delegateFunc(name: string, args: any[]) {
    const returnValue = (this[TransferrableKeys.implementation] as any)[name](...args);
    if (!this.upgraded) {
      this.queue.push({ fnName: name, args, isSetter: false });
    }
    return returnValue;
  }

  public [TransferrableKeys.set](name: string, args: any[]) {
    (this[TransferrableKeys.implementation] as any)[name] = args[0];
    if (!this.upgraded) {
      this.queue.push({ fnName: name, args: args, isSetter: true });
    }
  }

  /* DRAWING RECTANGLES */
  clearRect(x: number, y: number, width: number, height: number): void {
    this.delegateFunc('clearRect', [...arguments]);
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    this.delegateFunc('fillRect', [...arguments]);
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    this.delegateFunc('strokeRect', [...arguments]);
  }

  /* DRAWING TEXT */
  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    this.delegateFunc('fillText', [...arguments]);
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    this.delegateFunc('strokeText', [...arguments]);
  }

  measureText(text: string): TextMetrics {
    return this.delegateFunc('measureText', [...arguments]);
  }

  getLineDash(): number[] {
    return this.delegateFunc('getLineDash', [...arguments]);
  }

  setLineDash(segments: number[]): void {
    this.delegateFunc('setLineDash', [...arguments]);
  }

  /* GRADIENTS AND PATTERNS */
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this.delegateFunc('createLinearGradient', [...arguments]);
  }

  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    return this.delegateFunc('createRadialGradient', [...arguments]);
  }

  createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null {
    return this.delegateFunc('createPattern', [...arguments]);
  }

  /* PATHS */
  beginPath(): void {
    this.delegateFunc('beginPath', [...arguments]);
  }

  closePath(): void {
    this.delegateFunc('closePath', [...arguments]);
  }

  moveTo(x: number, y: number): void {
    this.delegateFunc('moveTo', [...arguments]);
  }

  lineTo(x: number, y: number): void {
    this.delegateFunc('lineTo', [...arguments]);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.delegateFunc('bezierCurveTo', [...arguments]);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    this.delegateFunc('quadraticCurveTo', [...arguments]);
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, antiClockwise?: boolean): void {
    this.delegateFunc('arc', [...arguments]);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    this.delegateFunc('arcTo', [...arguments]);
  }

  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    antiClockwise?: boolean,
  ): void {
    this.delegateFunc('ellipse', [...arguments]);
  }

  rect(x: number, y: number, width: number, height: number): void {
    this.delegateFunc('rect', [...arguments]);
  }

  /* DRAWING PATHS */
  fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void {
    const args = [...arguments] as [Path2D, CanvasFillRule | undefined] | [CanvasFillRule | undefined];
    this.delegateFunc('fill', args);
  }

  stroke(path?: Path2D): void {
    const args = [...arguments] as [Path2D] | [];
    this.delegateFunc('stroke', args);
  }

  clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void {
    const args = [...arguments] as [Path2D, CanvasFillRule | undefined] | [CanvasFillRule | undefined];
    this.delegateFunc('clip', args);
  }

  isPointInPath(pathOrX: Path2D | number, xOrY: number, yOrFillRule?: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean {
    const args = [...arguments] as [number, number, CanvasFillRule | undefined] | [Path2D, number, number, CanvasFillRule | undefined];

    return this.delegateFunc('isPointInPath', args);
  }

  isPointInStroke(pathOrX: Path2D | number, xOrY: number, y?: number): boolean {
    const args = [...arguments] as [number, number] | [Path2D, number, number];
    return this.delegateFunc('isPointInStroke', args);
  }

  /* TRANSFORMATIONS */
  rotate(angle: number): void {
    this.delegateFunc('rotate', [...arguments]);
  }

  scale(x: number, y: number): void {
    this.delegateFunc('scale', [...arguments]);
  }

  translate(x: number, y: number): void {
    this.delegateFunc('translate', [...arguments]);
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this.delegateFunc('transform', [...arguments]);
  }

  setTransform(transformOrA?: DOMMatrix2DInit | number, bOrC?: number, cOrD?: number, dOrE?: number, eOrF?: number, f?: number): void {
    const args = [...arguments] as [] | [DOMMatrix2DInit] | [number, number, number, number, number, number];
    this.delegateFunc('setTransform', args);
  }

  /* experimental */

  resetTransform(): void {
    this.delegateFunc('resetTransform', [...arguments]);
  }

  /* DRAWING IMAGES */
  drawImage(image: CanvasImageSource, dx: number, dy: number): void {
    this.delegateFunc('drawImage', [...arguments]);
  }

  /* PIXEL MANIPULATION */
  createImageData(imagedataOrWidth: ImageData | number, height?: number): ImageData {
    const args = [...arguments] as [ImageData] | [number, number];
    return this.delegateFunc('createImageData', args);
  }

  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    return this.delegateFunc('getImageData', [...arguments]);
  }

  putImageData(imageData: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
    this.delegateFunc('putImageData', [...arguments]);
  }

  /* THE CANVAS STATE */
  save(): void {
    this.delegateFunc('save', [...arguments]);
  }

  restore(): void {
    this.delegateFunc('restore', [...arguments]);
  }

  // canvas property is readonly. We don't want to implement getters, but this must be here
  // in order for TypeScript to not complain (for now)
  get canvas(): ElementType {
    return this.canvasElement;
  }
}

[
  'lineWidth',
  'lineCap',
  'lineJoin',
  'miterLimit',
  'lineDashOffset',
  'font',
  'textAlign',
  'textBaseline',
  'direction',
  'fillStyle',
  'strokeStyle',
  'shadowBlur',
  'shadowColor',
  'shadowOffsetX',
  'shadowOffsetY',
  'globalAlpha',
  'globalCompositeOperation',
  // Experimental
  'imageSmoothingEnabled',
  'imageSmoothingQuality',
  'filter',
].forEach(property => {
  Object.defineProperty(CanvasRenderingContext2DShim.prototype, property, {
    enumerable: true,
    get(): string | number {
      return this[TransferrableKeys.implementation][property];
    },
    set(): void {
      this[TransferrableKeys.set](property, [...arguments]);
    },
  });
});
