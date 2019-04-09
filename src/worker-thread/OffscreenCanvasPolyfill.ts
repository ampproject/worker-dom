import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import {
  CanvasRenderingContext2D,
  ImageSmoothingQuality,
  CanvasTextAlign,
  CanvasTextBaseline,
  CanvasLineCap,
  CanvasLineJoin,
  CanvasDirection,
} from './DOMTypes';
import { transfer } from './MutationTransfer';
import { Document } from './dom/Document';
import { NumericBoolean } from '../utils';
import { store } from './strings';

export class OffscreenCanvasPolyfill {
  canvas: HTMLCanvasElement;
  context: OffscreenCanvasRenderingContext2DPolyfill;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = new OffscreenCanvasRenderingContext2DPolyfill(canvas);
  }

  getContext(contextType: string): CanvasRenderingContext2D {
    if (!this.context) {
      if (contextType === '2D' || contextType === '2d') {
        this.context = new OffscreenCanvasRenderingContext2DPolyfill(this.canvas);
      } else {
        throw new Error('Context type not supported.');
      }
    }
    return this.context;
  }
}

class OffscreenCanvasRenderingContext2DPolyfill implements CanvasRenderingContext2D {
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  private postToMainThread(fnName: string, isSetter: NumericBoolean, stringArgIndex: number, argCount: number, args: any[], floatNeeded: boolean) {
    const stringsIdForMethodName = store(fnName);

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        isSetter,
        stringArgIndex,
        argCount,
        ...args,
      ],
      floatNeeded ? Float32Array : Uint16Array,
    );
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    this.postToMainThread('clearRect', NumericBoolean.FALSE, -1, 4, [...arguments], true);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this.postToMainThread('fillRect', NumericBoolean.FALSE, -1, 4, [...arguments], true);
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    this.postToMainThread('strokeRect', NumericBoolean.FALSE, -1, 4, [...arguments], true);
  }

  set lineWidth(value: number) {
    this.postToMainThread('lineWidth', NumericBoolean.TRUE, -1, 1, [value], true);
  }

  fillText(text: string, x: number, y: number) {
    this.postToMainThread('fillText', NumericBoolean.FALSE, 0, 3, [store(text), x, y], true);
  }

  moveTo(x: number, y: number) {
    this.postToMainThread('moveTo', NumericBoolean.FALSE, -1, 2, [...arguments], true);
  }

  lineTo(x: number, y: number) {
    this.postToMainThread('lineTo', NumericBoolean.FALSE, -1, 2, [...arguments], true);
  }

  closePath() {
    this.postToMainThread('closePath', NumericBoolean.FALSE, -1, 0, [], false);
  }

  stroke() {
    this.postToMainThread('stroke', NumericBoolean.FALSE, -1, 0, [], false);
  }

  restore() {
    this.postToMainThread('restore', NumericBoolean.FALSE, -1, 0, [], false);
  }

  save() {
    this.postToMainThread('save', NumericBoolean.FALSE, -1, 0, [], false);
  }

  resetTransform() {
    this.postToMainThread('resetTransform', NumericBoolean.FALSE, -1, 0, [], false);
  }

  rotate(angle: number) {
    this.postToMainThread('rotate', NumericBoolean.FALSE, -1, 1, [...arguments], true);
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.postToMainThread('transform', NumericBoolean.FALSE, -1, 6, [...arguments], true);
  }

  translate(x: number, y: number) {
    this.postToMainThread('translate', NumericBoolean.FALSE, -1, 2, [...arguments], true);
  }

  scale(x: number, y: number) {
    this.postToMainThread('scale', NumericBoolean.FALSE, -1, 2, [...arguments], true);
  }

  set globalAlpha(value: number) {
    this.postToMainThread('globalAlpha', NumericBoolean.TRUE, -1, 1, [value], true);
  }

  set globalCompositeOperation(value: string) {
    this.postToMainThread('globalCompositeOperation', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set imageSmoothingQuality(value: ImageSmoothingQuality) {
    this.postToMainThread('imageSmoothingQuality', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set fillStyle(value: string) {
    this.postToMainThread('fillStyle', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set strokeStyle(value: string) {
    this.postToMainThread('strokeStyle', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set shadowBlur(value: number) {
    this.postToMainThread('shadowBlur', NumericBoolean.TRUE, -1, 1, [value], true);
  }

  set shadowColor(value: string) {
    this.postToMainThread('shadowColor', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set shadowOffsetX(value: number) {
    this.postToMainThread('shadowOffsetX', NumericBoolean.TRUE, -1, 1, [value], true);
  }

  set shadowOffsetY(value: number) {
    this.postToMainThread('shadowOffsetY', NumericBoolean.TRUE, -1, 1, [value], true);
  }

  set filter(value: string) {
    this.postToMainThread('filter', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  beginPath() {
    this.postToMainThread('beginPath', NumericBoolean.FALSE, 0, 1, [], false);
  }

  strokeText(text: string, x: number, y: number) {
    this.postToMainThread('strokeText', NumericBoolean.FALSE, 0, 3, [store(text), x, y], true);
  }

  set textAlign(value: CanvasTextAlign) {
    this.postToMainThread('textAlign', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set textBaseline(value: CanvasTextBaseline) {
    this.postToMainThread('textBaseline', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set lineCap(value: CanvasLineCap) {
    this.postToMainThread('lineCap', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set lineDashOffset(value: number) {
    this.postToMainThread('lineDashOffset', NumericBoolean.TRUE, -1, 1, [value], true);
  }

  set lineJoin(value: CanvasLineJoin) {
    this.postToMainThread('lineJoin', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set miterLimit(value: number) {
    this.postToMainThread('miterLimit', NumericBoolean.TRUE, -1, 1, [value], true);
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    this.postToMainThread('arc', NumericBoolean.FALSE, -1, 5, [...arguments], true);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this.postToMainThread('arcTo', NumericBoolean.FALSE, -1, 5, [...arguments], true);
  }

  set direction(value: CanvasDirection) {
    this.postToMainThread('direction', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  set font(value: string) {
    this.postToMainThread('font', NumericBoolean.TRUE, 0, 1, [store(value)], false);
  }

  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number) {
    this.postToMainThread('ellipse', NumericBoolean.FALSE, -1, 7, [...arguments], true);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this.postToMainThread('bezierCurveTo', NumericBoolean.FALSE, -1, 6, [...arguments], true);
  }

  rect(x: number, y: number, width: number, height: number) {
    this.postToMainThread('rect', NumericBoolean.FALSE, -1, 4, [...arguments], true);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.postToMainThread('quadraticCurveTo', NumericBoolean.FALSE, -1, 4, [...arguments], true);
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
  set imageSmoothingEnabled(value: boolean) {}
  setTransform() {}

  clip() {}
  fill() {}

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
  // issue: has four signatures, all of them with a CanvasImageSource arg
  drawImage() {}

  createImageData(): ImageData {
    return {} as ImageData;
  }
  getImageData(): ImageData {
    return {} as ImageData;
  }
  putImageData() {}
  getLineDash(): number[] {
    return [];
  }

  // this one takes an array of numbers. Should be straightforward.
  setLineDash(lineDash: number[]) {}
}
