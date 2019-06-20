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

import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import {
  CanvasRenderingContext2D,
  ImageSmoothingQuality,
  CanvasTextAlign,
  CanvasTextBaseline,
  CanvasLineCap,
  CanvasLineJoin,
  CanvasDirection,
  CanvasFillRule,
} from './CanvasTypes';
import { transfer } from '../MutationTransfer';
import { Document } from '../dom/Document';
import { NumericBoolean, toLower } from '../../utils';
import { store } from '../strings';
import { HTMLElement } from '../dom/HTMLElement';

/**
 * Handles calls to a CanvasRenderingContext2D object in cases where the user's environment does not
 * support native OffscreenCanvas.
 */
export class OffscreenCanvasPolyfill<ElementType extends HTMLElement> {
  canvas: ElementType;
  context: OffscreenCanvasRenderingContext2DPolyfill<ElementType>;

  constructor(canvas: ElementType) {
    this.canvas = canvas;
  }

  getContext(contextType: string): CanvasRenderingContext2D {
    if (!this.context) {
      if (toLower(contextType) === '2d') {
        this.context = new OffscreenCanvasRenderingContext2DPolyfill<ElementType>(this.canvas);
      } else {
        throw new Error('Context type not supported.');
      }
    }
    return this.context;
  }
}

class OffscreenCanvasRenderingContext2DPolyfill<ElementType extends HTMLElement> implements CanvasRenderingContext2D {
  private canvasElement: ElementType;
  private lineDash: number[];

  constructor(canvas: ElementType) {
    this.canvasElement = canvas;
    this.lineDash = [];
  }

  private [TransferrableKeys.mutated](fnName: string, isSetter: NumericBoolean, stringArgIndex: number, args: any[], float32Needed: boolean) {
    transfer(this.canvasElement.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_POLYFILL,
      this.canvasElement[TransferrableKeys.index],
      float32Needed ? NumericBoolean.TRUE : NumericBoolean.FALSE,
      args.length,
      store(fnName),
      isSetter,
      stringArgIndex,
      ...(float32Needed ? new Uint16Array(new Float32Array(args).buffer) : args),
    ]);
  }

  get canvas(): ElementType {
    return this.canvasElement;
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('clearRect', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('fillRect', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('strokeRect', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  set lineWidth(value: number) {
    this[TransferrableKeys.mutated]('lineWidth', NumericBoolean.TRUE, 0, [...arguments], true);
  }

  fillText(text: string, x: number, y: number, maxWidth?: number) {
    const numberArgs = [...arguments].slice(1);
    this[TransferrableKeys.mutated]('fillText', NumericBoolean.FALSE, 1, [store(text), ...numberArgs], true);
  }

  moveTo(x: number, y: number) {
    this[TransferrableKeys.mutated]('moveTo', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  lineTo(x: number, y: number) {
    this[TransferrableKeys.mutated]('lineTo', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  closePath() {
    this[TransferrableKeys.mutated]('closePath', NumericBoolean.FALSE, 0, [], false);
  }

  stroke() {
    this[TransferrableKeys.mutated]('stroke', NumericBoolean.FALSE, 0, [], false);
  }

  restore() {
    this[TransferrableKeys.mutated]('restore', NumericBoolean.FALSE, 0, [], false);
  }

  save() {
    this[TransferrableKeys.mutated]('save', NumericBoolean.FALSE, 0, [], false);
  }

  resetTransform() {
    this[TransferrableKeys.mutated]('resetTransform', NumericBoolean.FALSE, 0, [], false);
  }

  rotate(angle: number) {
    this[TransferrableKeys.mutated]('rotate', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this[TransferrableKeys.mutated]('transform', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  translate(x: number, y: number) {
    this[TransferrableKeys.mutated]('translate', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  scale(x: number, y: number) {
    this[TransferrableKeys.mutated]('scale', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  set globalAlpha(value: number) {
    this[TransferrableKeys.mutated]('globalAlpha', NumericBoolean.TRUE, 0, [...arguments], true);
  }

  set globalCompositeOperation(value: string) {
    this[TransferrableKeys.mutated]('globalCompositeOperation', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set imageSmoothingQuality(value: ImageSmoothingQuality) {
    this[TransferrableKeys.mutated]('imageSmoothingQuality', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set fillStyle(value: string) {
    this[TransferrableKeys.mutated]('fillStyle', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set strokeStyle(value: string) {
    this[TransferrableKeys.mutated]('strokeStyle', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set shadowBlur(value: number) {
    this[TransferrableKeys.mutated]('shadowBlur', NumericBoolean.TRUE, 0, [...arguments], true);
  }

  set shadowColor(value: string) {
    this[TransferrableKeys.mutated]('shadowColor', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set shadowOffsetX(value: number) {
    this[TransferrableKeys.mutated]('shadowOffsetX', NumericBoolean.TRUE, 0, [...arguments], true);
  }

  set shadowOffsetY(value: number) {
    this[TransferrableKeys.mutated]('shadowOffsetY', NumericBoolean.TRUE, 0, [...arguments], true);
  }

  set filter(value: string) {
    this[TransferrableKeys.mutated]('filter', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  beginPath() {
    this[TransferrableKeys.mutated]('beginPath', NumericBoolean.FALSE, 0, [], false);
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    const numberArgs = [...arguments].slice(1);
    this[TransferrableKeys.mutated]('strokeText', NumericBoolean.FALSE, 1, [store(text), ...numberArgs], true);
  }

  set textAlign(value: CanvasTextAlign) {
    this[TransferrableKeys.mutated]('textAlign', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set textBaseline(value: CanvasTextBaseline) {
    this[TransferrableKeys.mutated]('textBaseline', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set lineCap(value: CanvasLineCap) {
    this[TransferrableKeys.mutated]('lineCap', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set lineDashOffset(value: number) {
    this[TransferrableKeys.mutated]('lineDashOffset', NumericBoolean.TRUE, 0, [...arguments], true);
  }

  set lineJoin(value: CanvasLineJoin) {
    this[TransferrableKeys.mutated]('lineJoin', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set miterLimit(value: number) {
    this[TransferrableKeys.mutated]('miterLimit', NumericBoolean.TRUE, 0, [...arguments], true);
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    this[TransferrableKeys.mutated]('arc', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this[TransferrableKeys.mutated]('arcTo', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  set direction(value: CanvasDirection) {
    this[TransferrableKeys.mutated]('direction', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  set font(value: string) {
    this[TransferrableKeys.mutated]('font', NumericBoolean.TRUE, 1, [store(value)], false);
  }

  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    this[TransferrableKeys.mutated]('ellipse', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this[TransferrableKeys.mutated]('bezierCurveTo', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  rect(x: number, y: number, width: number, height: number) {
    this[TransferrableKeys.mutated]('rect', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this[TransferrableKeys.mutated]('quadraticCurveTo', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  set imageSmoothingEnabled(value: boolean) {
    this[TransferrableKeys.mutated]('imageSmoothingEnabled', NumericBoolean.TRUE, 0, [...arguments], false);
  }

  setLineDash(lineDash: number[]) {
    lineDash = [...lineDash];
    if (lineDash.length % 2 !== 0) {
      lineDash = lineDash.concat(lineDash);
    }
    this.lineDash = lineDash;
    this[TransferrableKeys.mutated]('setLineDash', NumericBoolean.FALSE, 0, lineDash, true);
  }

  getLineDash(): number[] {
    return [...this.lineDash];
  }

  clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule) {
    if (typeof pathOrFillRule === 'object') {
      throw new Error('clip(Path2D) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('clip', NumericBoolean.FALSE, 1, [...arguments], false);
  }

  fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule) {
    if (typeof pathOrFillRule === 'object') {
      throw new Error('fill(Path2D) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('fill', NumericBoolean.FALSE, 1, [...arguments], false);
  }

  // Method has a different signature in MDN than it does in HTML spec
  setTransform(transformOrA?: DOMMatrix2DInit | number, bOrC?: number, cOrD?: number, dOrE?: number, eOrF?: number, f?: number) {
    if (typeof transformOrA === 'object') {
      throw new Error('setTransform(DOMMatrix2DInit) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('setTransform', NumericBoolean.FALSE, 0, [...arguments], true);
  }

  ////////////////////////////////////////
  // The following methods require more to our transfer process:
  createLinearGradient(): CanvasGradient {
    return {} as CanvasGradient;
  }
  createPattern(): CanvasPattern {
    return {} as CanvasPattern;
  }
  createRadialGradient(): CanvasGradient {
    return {} as CanvasGradient;
  }

  // issue: has more than one signature, one with a Path2D arg
  isPointInPath(): boolean {
    return true;
  }

  // issue: has more than one signature, one with a Path2D arg
  isPointInStroke(): boolean {
    return true;
  }

  // issue: has a return value
  measureText(): TextMetrics {
    return {} as TextMetrics;
  }

  createImageData(): ImageData {
    return {} as ImageData;
  }
  getImageData(): ImageData {
    return {} as ImageData;
  }
  putImageData() {}

  // issue: has four signatures, all of them with a CanvasImageSource arg
  drawImage() {}
}
