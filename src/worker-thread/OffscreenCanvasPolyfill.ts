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
  CanvasFillRule,
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
  lineDash: number[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.lineDash = [];
  }

  private postToMainThread(
    fnName: string,
    isSetter: NumericBoolean,
    stringArgIndex: number,
    argCount: number,
    args: any[],
    float32Needed: boolean,
    hasArrayArgument = NumericBoolean.FALSE,
  ) {
    if (argCount !== args.length) {
      throw new Error('Passed argCount does not match length of args[]!');
    }

    if (float32Needed) {
      const mutation = [store(fnName), isSetter, stringArgIndex, hasArrayArgument, ...args];
      const floatArray = new Float32Array(mutation);
      const u16array = new Uint16Array(floatArray.buffer);

      // The following values are needed to be correct in the Uint16Array representation:
      // - MutationType since it's accessed by mutator.ts
      // - target, since it's accessed by mutator.ts
      // - floatNeeded, to know whether or not to convert to a Float32Array
      // - argCount, since the mutation array size is needed before converting
      // These values are followed by filler zeroes to maintain index consistency.
      const u16values = [
        TransferrableMutationType.OFFSCREEN_POLYFILL,
        this.canvas[TransferrableKeys.index],
        NumericBoolean.TRUE,
        argCount,
        0,
        0,
        0,
        0,
      ];

      for (let n of u16array) {
        u16values.push(n);
      }

      transfer(this.canvas.ownerDocument as Document, u16values);
    } else {
      transfer(this.canvas.ownerDocument as Document, [
        TransferrableMutationType.OFFSCREEN_POLYFILL,
        this.canvas[TransferrableKeys.index],
        NumericBoolean.FALSE,
        argCount,
        store(fnName),
        isSetter,
        stringArgIndex,
        hasArrayArgument,
        ...args,
      ]);
    }
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    this.postToMainThread('clearRect', NumericBoolean.FALSE, 0, 4, [...arguments], true);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this.postToMainThread('fillRect', NumericBoolean.FALSE, 0, 4, [...arguments], true);
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    this.postToMainThread('strokeRect', NumericBoolean.FALSE, 0, 4, [...arguments], true);
  }

  set lineWidth(value: number) {
    this.postToMainThread('lineWidth', NumericBoolean.TRUE, 0, 1, [value], true);
  }

  fillText(text: string, x: number, y: number, maxWidth?: number) {
    const args = [...arguments] as [string, number, number, number?];
    const numberArgs = args[3] ? args.slice(1) : args.slice(1, 3);
    this.postToMainThread('fillText', NumericBoolean.FALSE, 1, numberArgs.length + 1, [store(text), ...numberArgs], true);
  }

  moveTo(x: number, y: number) {
    this.postToMainThread('moveTo', NumericBoolean.FALSE, 0, 2, [...arguments], true);
  }

  lineTo(x: number, y: number) {
    this.postToMainThread('lineTo', NumericBoolean.FALSE, 0, 2, [...arguments], true);
  }

  closePath() {
    this.postToMainThread('closePath', NumericBoolean.FALSE, 0, 0, [], false);
  }

  stroke() {
    this.postToMainThread('stroke', NumericBoolean.FALSE, 0, 0, [], false);
  }

  restore() {
    this.postToMainThread('restore', NumericBoolean.FALSE, 0, 0, [], false);
  }

  save() {
    this.postToMainThread('save', NumericBoolean.FALSE, 0, 0, [], false);
  }

  resetTransform() {
    this.postToMainThread('resetTransform', NumericBoolean.FALSE, 0, 0, [], false);
  }

  rotate(angle: number) {
    this.postToMainThread('rotate', NumericBoolean.FALSE, 0, 1, [...arguments], true);
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.postToMainThread('transform', NumericBoolean.FALSE, 0, 6, [...arguments], true);
  }

  translate(x: number, y: number) {
    this.postToMainThread('translate', NumericBoolean.FALSE, 0, 2, [...arguments], true);
  }

  scale(x: number, y: number) {
    this.postToMainThread('scale', NumericBoolean.FALSE, 0, 2, [...arguments], true);
  }

  set globalAlpha(value: number) {
    this.postToMainThread('globalAlpha', NumericBoolean.TRUE, 0, 1, [value], true);
  }

  set globalCompositeOperation(value: string) {
    this.postToMainThread('globalCompositeOperation', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set imageSmoothingQuality(value: ImageSmoothingQuality) {
    this.postToMainThread('imageSmoothingQuality', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set fillStyle(value: string) {
    this.postToMainThread('fillStyle', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set strokeStyle(value: string) {
    this.postToMainThread('strokeStyle', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set shadowBlur(value: number) {
    this.postToMainThread('shadowBlur', NumericBoolean.TRUE, 0, 1, [value], true);
  }

  set shadowColor(value: string) {
    this.postToMainThread('shadowColor', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set shadowOffsetX(value: number) {
    this.postToMainThread('shadowOffsetX', NumericBoolean.TRUE, 0, 1, [value], true);
  }

  set shadowOffsetY(value: number) {
    this.postToMainThread('shadowOffsetY', NumericBoolean.TRUE, 0, 1, [value], true);
  }

  set filter(value: string) {
    this.postToMainThread('filter', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  beginPath() {
    this.postToMainThread('beginPath', NumericBoolean.FALSE, 0, 0, [], false);
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    const args = [...arguments] as [string, number, number, number?];
    const numberArgs = args[3] ? args.slice(1) : args.slice(1, 3);
    this.postToMainThread('strokeText', NumericBoolean.FALSE, 1, numberArgs.length + 1, [store(text), ...numberArgs], true);
  }

  set textAlign(value: CanvasTextAlign) {
    this.postToMainThread('textAlign', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set textBaseline(value: CanvasTextBaseline) {
    this.postToMainThread('textBaseline', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set lineCap(value: CanvasLineCap) {
    this.postToMainThread('lineCap', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set lineDashOffset(value: number) {
    this.postToMainThread('lineDashOffset', NumericBoolean.TRUE, 0, 1, [value], true);
  }

  set lineJoin(value: CanvasLineJoin) {
    this.postToMainThread('lineJoin', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set miterLimit(value: number) {
    this.postToMainThread('miterLimit', NumericBoolean.TRUE, 0, 1, [value], true);
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    const args = [...arguments] as [number, number, number, number, number, boolean?];
    const length = args[5] ? 6 : 5;
    this.postToMainThread('arc', NumericBoolean.FALSE, 0, length, args, true);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this.postToMainThread('arcTo', NumericBoolean.FALSE, 0, 5, [...arguments], true);
  }

  set direction(value: CanvasDirection) {
    this.postToMainThread('direction', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  set font(value: string) {
    this.postToMainThread('font', NumericBoolean.TRUE, 1, 1, [store(value)], false);
  }

  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    const args = [...arguments] as [number, number, number, number, number, number, number, boolean?];
    const length = args[7] ? 8 : 7;
    this.postToMainThread('ellipse', NumericBoolean.FALSE, 0, length, args, true);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this.postToMainThread('bezierCurveTo', NumericBoolean.FALSE, 0, 6, [...arguments], true);
  }

  rect(x: number, y: number, width: number, height: number) {
    this.postToMainThread('rect', NumericBoolean.FALSE, 0, 4, [...arguments], true);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.postToMainThread('quadraticCurveTo', NumericBoolean.FALSE, 0, 4, [...arguments], true);
  }

  set imageSmoothingEnabled(value: boolean) {
    const numericValue = value ? NumericBoolean.TRUE : NumericBoolean.FALSE;
    this.postToMainThread('imageSmoothingEnabled', NumericBoolean.TRUE, 0, 1, [numericValue], false);
  }

  setLineDash(lineDash: number[]) {
    this.lineDash = lineDash;
    const arrLength = lineDash.length;
    this.postToMainThread('setLineDash', NumericBoolean.FALSE, 0, arrLength, lineDash, true, NumericBoolean.TRUE);
  }

  getLineDash(): number[] {
    if (this.lineDash.length % 2 === 0) {
      return this.lineDash;
    } else {
      return this.lineDash.concat(this.lineDash);
    }
  }

  clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule) {
    const args = [...arguments] as [CanvasFillRule] | [];
    this.postToMainThread('clip', NumericBoolean.FALSE, 1, args.length, args, false);
  }

  fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule) {
    const args = [...arguments] as [CanvasFillRule] | [];
    this.postToMainThread('fill', NumericBoolean.FALSE, 1, args.length, args, false);
  }

  // Method has a different signature in MDN than it does in HTML spec
  setTransform(transformOrA?: DOMMatrix2DInit | number, bOrC?: number, cOrD?: number, dOrE?: number, eOrF?: number, f?: number) {
    const args = [...arguments] as [number, number, number, number, number, number];
    this.postToMainThread('setTransform', NumericBoolean.FALSE, 0, 6, args, true);
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
