import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import {
  CanvasDirection,
  CanvasFillRule,
  CanvasImageSource,
  CanvasLineCap,
  CanvasLineJoin,
  CanvasRenderingContext2D,
  CanvasTextAlign,
  CanvasTextBaseline,
  ImageSmoothingQuality,
} from './CanvasTypes';
import { transfer } from '../MutationTransfer';
import { Document } from '../dom/Document';
import { toLower } from '../../utils';
import { HTMLElement } from '../dom/HTMLElement';
import { TransferrableObject } from '../worker-thread';
import { CanvasGradient } from './CanvasGradient';
import { CanvasPattern } from './CanvasPattern';
import { HTMLCanvasElement } from '../dom/HTMLCanvasElement';
import { HTMLImageElement } from '../dom/HTMLImageElement';
import { createObjectReference } from '../object-reference';

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

class OffscreenCanvasRenderingContext2DPolyfill<ElementType extends HTMLElement> implements CanvasRenderingContext2D, TransferrableObject {
  private readonly imageDataStub = new Uint8ClampedArray([127, 127, 127, 127]);

  private canvasElement: ElementType;
  private lineDash: number[];

  constructor(canvas: ElementType) {
    this.canvasElement = canvas;
    this.lineDash = [];
  }

  private [TransferrableKeys.mutated](fnName: string, args: any[]) {
    transfer(this.canvasElement.ownerDocument as Document, [TransferrableMutationType.OBJECT_MUTATION, fnName, this, args]);
  }

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.CanvasRenderingContext2D, this.canvasElement[TransferrableKeys.index]];
  }

  get canvas(): ElementType {
    return this.canvasElement;
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('clearRect', [...arguments]);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('fillRect', [...arguments]);
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    this[TransferrableKeys.mutated]('strokeRect', [...arguments]);
  }

  roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void {
    this[TransferrableKeys.mutated]('roundRect', [...arguments]);
  }
  
  set lineWidth(value: number) {
    this[TransferrableKeys.mutated]('lineWidth', [...arguments]);
  }

  fillText(text: string, x: number, y: number, maxWidth?: number) {
    this[TransferrableKeys.mutated]('fillText', [...arguments]);
  }

  moveTo(x: number, y: number) {
    this[TransferrableKeys.mutated]('moveTo', [...arguments]);
  }

  lineTo(x: number, y: number) {
    this[TransferrableKeys.mutated]('lineTo', [...arguments]);
  }

  closePath() {
    this[TransferrableKeys.mutated]('closePath', []);
  }

  stroke() {
    this[TransferrableKeys.mutated]('stroke', []);
  }

  restore() {
    this[TransferrableKeys.mutated]('restore', []);
  }

  save() {
    this[TransferrableKeys.mutated]('save', []);
  }

  resetTransform() {
    this[TransferrableKeys.mutated]('resetTransform', []);
  }

  rotate(angle: number) {
    this[TransferrableKeys.mutated]('rotate', [...arguments]);
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this[TransferrableKeys.mutated]('transform', [...arguments]);
  }

  translate(x: number, y: number) {
    this[TransferrableKeys.mutated]('translate', [...arguments]);
  }

  scale(x: number, y: number) {
    this[TransferrableKeys.mutated]('scale', [...arguments]);
  }

  set globalAlpha(value: number) {
    this[TransferrableKeys.mutated]('globalAlpha', [...arguments]);
  }

  set globalCompositeOperation(value: string) {
    this[TransferrableKeys.mutated]('globalCompositeOperation', [...arguments]);
  }

  set imageSmoothingQuality(value: ImageSmoothingQuality) {
    this[TransferrableKeys.mutated]('imageSmoothingQuality', [...arguments]);
  }

  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    this[TransferrableKeys.mutated]('fillStyle', [...arguments]);
  }

  set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
    this[TransferrableKeys.mutated]('strokeStyle', [...arguments]);
  }

  set shadowBlur(value: number) {
    this[TransferrableKeys.mutated]('shadowBlur', [...arguments]);
  }

  set shadowColor(value: string) {
    this[TransferrableKeys.mutated]('shadowColor', [...arguments]);
  }

  set shadowOffsetX(value: number) {
    this[TransferrableKeys.mutated]('shadowOffsetX', [...arguments]);
  }

  set shadowOffsetY(value: number) {
    this[TransferrableKeys.mutated]('shadowOffsetY', [...arguments]);
  }

  set filter(value: string) {
    this[TransferrableKeys.mutated]('filter', [...arguments]);
  }

  beginPath() {
    this[TransferrableKeys.mutated]('beginPath', []);
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    this[TransferrableKeys.mutated]('strokeText', [...arguments]);
  }

  set textAlign(value: CanvasTextAlign) {
    this[TransferrableKeys.mutated]('textAlign', [...arguments]);
  }

  set textBaseline(value: CanvasTextBaseline) {
    this[TransferrableKeys.mutated]('textBaseline', [...arguments]);
  }

  set lineCap(value: CanvasLineCap) {
    this[TransferrableKeys.mutated]('lineCap', [...arguments]);
  }

  set lineDashOffset(value: number) {
    this[TransferrableKeys.mutated]('lineDashOffset', [...arguments]);
  }

  set lineJoin(value: CanvasLineJoin) {
    this[TransferrableKeys.mutated]('lineJoin', [...arguments]);
  }

  set miterLimit(value: number) {
    this[TransferrableKeys.mutated]('miterLimit', [...arguments]);
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    this[TransferrableKeys.mutated]('arc', [...arguments]);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this[TransferrableKeys.mutated]('arcTo', [...arguments]);
  }

  set direction(value: CanvasDirection) {
    this[TransferrableKeys.mutated]('direction', [...arguments]);
  }

  set font(value: string) {
    this[TransferrableKeys.mutated]('font', [...arguments]);
  }

  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    this[TransferrableKeys.mutated]('ellipse', [...arguments]);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this[TransferrableKeys.mutated]('bezierCurveTo', [...arguments]);
  }

  rect(x: number, y: number, width: number, height: number) {
    this[TransferrableKeys.mutated]('rect', [...arguments]);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this[TransferrableKeys.mutated]('quadraticCurveTo', [...arguments]);
  }

  set imageSmoothingEnabled(value: boolean) {
    this[TransferrableKeys.mutated]('imageSmoothingEnabled', [...arguments]);
  }

  setLineDash(lineDash: number[]) {
    lineDash = [...lineDash];
    if (lineDash.length % 2 !== 0) {
      lineDash = lineDash.concat(lineDash);
    }
    this.lineDash = lineDash;
    this[TransferrableKeys.mutated]('setLineDash', [...arguments]);
  }

  getLineDash(): number[] {
    return [...this.lineDash];
  }

  clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule) {
    if (typeof pathOrFillRule === 'object') {
      throw new Error('clip(Path2D) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('clip', [...arguments]);
  }

  fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule) {
    if (typeof pathOrFillRule === 'object') {
      throw new Error('fill(Path2D) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('fill', [...arguments]);
  }

  // Method has a different signature in MDN than it does in HTML spec
  setTransform(transformOrA?: DOMMatrix2DInit | number, bOrC?: number, cOrD?: number, dOrE?: number, eOrF?: number, f?: number) {
    if (typeof transformOrA === 'object') {
      throw new Error('setTransform(DOMMatrix2DInit) is currently not supported!');
    }
    this[TransferrableKeys.mutated]('setTransform', [...arguments]);
  }

  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return createObjectReference(
      this.canvasElement.ownerDocument as Document,
      this,
      'createLinearGradient',
      [...arguments],
      (id) => new CanvasGradient(id, this.canvasElement.ownerDocument as Document),
    );
  }

  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    return createObjectReference(
      this.canvasElement.ownerDocument as Document,
      this,
      'createRadialGradient',
      [...arguments],
      (id) => new CanvasGradient(id, this.canvasElement.ownerDocument as Document),
    );
  }

  createPattern(image: HTMLCanvasElement | HTMLImageElement, repetition: string): CanvasPattern {
    return createObjectReference(this.canvasElement.ownerDocument as Document, this, 'createPattern', [...arguments], (id) => new CanvasPattern(id));
  }

  drawImage(image: CanvasImageSource, dx: number, dy: number) {
    this[TransferrableKeys.mutated]('drawImage', [...arguments]);
  }

  createImageData(sw: number, sh: number): ImageData;
  createImageData(imagedata: ImageData): ImageData;
  createImageData(sw: number | ImageData, sh?: number): ImageData {
    sh = sh || 1;
    if (typeof sw === 'object') {
      sh = sw.height;
      sw = sw.width;
    }

    return { data: new Uint8ClampedArray(sw * sh * 4), height: sh, width: sw } as ImageData;
  }

  getImageData(x: number, y: number, sw: number, sh: number): ImageData {
    const data = new Uint8ClampedArray(sw * sh * 4);
    data[0] = this.imageDataStub[0];
    data[1] = this.imageDataStub[1];
    data[2] = this.imageDataStub[2];
    data[3] = this.imageDataStub[3];

    return { data, height: sh, width: sw } as ImageData;
  }

  putImageData(imagedata: ImageData, dx: number, dy: number): void;
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
    this[TransferrableKeys.mutated]('putImageData', [...arguments]);
  }

  isPointInPath(): boolean {
    throw new Error('isPointInPath is not implemented.');
  }

  isPointInStroke(): boolean {
    throw new Error('isPointInStroke is not implemented.');
  }

  measureText(): TextMetrics {
    throw new Error('measureText is not implemented.');
  }
}
