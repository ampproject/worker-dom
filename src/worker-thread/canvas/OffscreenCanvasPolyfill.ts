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
import { serialize } from '../global-id';

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

  private [TransferrableKeys.mutated](fnName: string, isSetter: NumericBoolean, args: any[]) {
    transfer(this.canvasElement.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_POLYFILL,
      this.canvasElement[TransferrableKeys.index],
      args.length,
      store(fnName),
      isSetter,
      ...serialize(args),
    ]);
  }

  get canvas(): ElementType {
    return this.canvasElement;
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('clearRect', NumericBoolean.FALSE, [...arguments]);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('fillRect', NumericBoolean.FALSE, [...arguments]);
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('strokeRect', NumericBoolean.FALSE, [...arguments]);
  }

  set lineWidth(value: number) {
    this[TransferrableKeys.mutated]('lineWidth', NumericBoolean.TRUE, [...arguments]);
  }

  fillText(text: string, x: number, y: number, maxWidth?: number) {
    const numberArgs = [...arguments].slice(1);
    this[TransferrableKeys.mutated]('fillText', NumericBoolean.FALSE, [store(text), ...numberArgs]);
  }

  moveTo(x: number, y: number) {
    this[TransferrableKeys.mutated]('moveTo', NumericBoolean.FALSE, [...arguments]);
  }

  lineTo(x: number, y: number) {
    this[TransferrableKeys.mutated]('lineTo', NumericBoolean.FALSE, [...arguments]);
  }

  closePath() {
    this[TransferrableKeys.mutated]('closePath', NumericBoolean.FALSE, []);
  }

  stroke() {
    this[TransferrableKeys.mutated]('stroke', NumericBoolean.FALSE, []);
  }

  restore() {
    this[TransferrableKeys.mutated]('restore', NumericBoolean.FALSE, []);
  }

  save() {
    this[TransferrableKeys.mutated]('save', NumericBoolean.FALSE, []);
  }

  resetTransform() {
    this[TransferrableKeys.mutated]('resetTransform', NumericBoolean.FALSE, []);
  }

  rotate(angle: number) {
    this[TransferrableKeys.mutated]('rotate', NumericBoolean.FALSE, [...arguments]);
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this[TransferrableKeys.mutated]('transform', NumericBoolean.FALSE, [...arguments]);
  }

  translate(x: number, y: number) {
    this[TransferrableKeys.mutated]('translate', NumericBoolean.FALSE, [...arguments]);
  }

  scale(x: number, y: number) {
    this[TransferrableKeys.mutated]('scale', NumericBoolean.FALSE, [...arguments]);
  }

  set globalAlpha(value: number) {
    this[TransferrableKeys.mutated]('globalAlpha', NumericBoolean.TRUE, [...arguments]);
  }

  set globalCompositeOperation(value: string) {
    this[TransferrableKeys.mutated]('globalCompositeOperation', NumericBoolean.TRUE, [store(value)]);
  }

  set imageSmoothingQuality(value: ImageSmoothingQuality) {
    this[TransferrableKeys.mutated]('imageSmoothingQuality', NumericBoolean.TRUE, [store(value)]);
  }

  set fillStyle(value: string) {
    this[TransferrableKeys.mutated]('fillStyle', NumericBoolean.TRUE, [store(value)]);
  }

  set strokeStyle(value: string) {
    this[TransferrableKeys.mutated]('strokeStyle', NumericBoolean.TRUE, [store(value)]);
  }

  set shadowBlur(value: number) {
    this[TransferrableKeys.mutated]('shadowBlur', NumericBoolean.TRUE, [...arguments]);
  }

  set shadowColor(value: string) {
    this[TransferrableKeys.mutated]('shadowColor', NumericBoolean.TRUE, [store(value)]);
  }

  set shadowOffsetX(value: number) {
    this[TransferrableKeys.mutated]('shadowOffsetX', NumericBoolean.TRUE, [...arguments]);
  }

  set shadowOffsetY(value: number) {
    this[TransferrableKeys.mutated]('shadowOffsetY', NumericBoolean.TRUE, [...arguments]);
  }

  set filter(value: string) {
    this[TransferrableKeys.mutated]('filter', NumericBoolean.TRUE, [store(value)]);
  }

  beginPath() {
    this[TransferrableKeys.mutated]('beginPath', NumericBoolean.FALSE, []);
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    const numberArgs = [...arguments].slice(1);
    this[TransferrableKeys.mutated]('strokeText', NumericBoolean.FALSE, [store(text), ...numberArgs]);
  }

  set textAlign(value: CanvasTextAlign) {
    this[TransferrableKeys.mutated]('textAlign', NumericBoolean.TRUE, [store(value)]);
  }

  set textBaseline(value: CanvasTextBaseline) {
    this[TransferrableKeys.mutated]('textBaseline', NumericBoolean.TRUE, [store(value)]);
  }

  set lineCap(value: CanvasLineCap) {
    this[TransferrableKeys.mutated]('lineCap', NumericBoolean.TRUE, [store(value)]);
  }

  set lineDashOffset(value: number) {
    this[TransferrableKeys.mutated]('lineDashOffset', NumericBoolean.TRUE, [...arguments]);
  }

  set lineJoin(value: CanvasLineJoin) {
    this[TransferrableKeys.mutated]('lineJoin', NumericBoolean.TRUE, [store(value)]);
  }

  set miterLimit(value: number) {
    this[TransferrableKeys.mutated]('miterLimit', NumericBoolean.TRUE, [...arguments]);
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    this[TransferrableKeys.mutated]('arc', NumericBoolean.FALSE, [...arguments]);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this[TransferrableKeys.mutated]('arcTo', NumericBoolean.FALSE, [...arguments]);
  }

  set direction(value: CanvasDirection) {
    this[TransferrableKeys.mutated]('direction', NumericBoolean.TRUE, [store(value)]);
  }

  set font(value: string) {
    this[TransferrableKeys.mutated]('font', NumericBoolean.TRUE, [store(value)]);
  }

  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    this[TransferrableKeys.mutated]('ellipse', NumericBoolean.FALSE, [...arguments]);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this[TransferrableKeys.mutated]('bezierCurveTo', NumericBoolean.FALSE, [...arguments]);
  }

  rect(x: number, y: number, width: number, height: number) {
    this[TransferrableKeys.mutated]('rect', NumericBoolean.FALSE, [...arguments]);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this[TransferrableKeys.mutated]('quadraticCurveTo', NumericBoolean.FALSE, [...arguments]);
  }

  set imageSmoothingEnabled(value: boolean) {
    this[TransferrableKeys.mutated]('imageSmoothingEnabled', NumericBoolean.TRUE, [...arguments]);
  }

  setLineDash(lineDash: number[]) {
    lineDash = [...lineDash];
    if (lineDash.length % 2 !== 0) {
      lineDash = lineDash.concat(lineDash);
    }
    this.lineDash = lineDash;
    this[TransferrableKeys.mutated]('setLineDash', NumericBoolean.FALSE, lineDash);
  }

  getLineDash(): number[] {
    return [...this.lineDash];
  }

  clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule) {
    if (typeof pathOrFillRule === 'object') {
      throw new Error('clip(Path2D) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('clip', NumericBoolean.FALSE, [...arguments]);
  }

  fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule) {
    if (typeof pathOrFillRule === 'object') {
      throw new Error('fill(Path2D) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('fill', NumericBoolean.FALSE, [...arguments]);
  }

  // Method has a different signature in MDN than it does in HTML spec
  setTransform(transformOrA?: DOMMatrix2DInit | number, bOrC?: number, cOrD?: number, dOrE?: number, eOrF?: number, f?: number) {
    if (typeof transformOrA === 'object') {
      throw new Error('setTransform(DOMMatrix2DInit) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('setTransform', NumericBoolean.FALSE, [...arguments]);
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
