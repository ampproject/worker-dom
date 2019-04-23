import {
  CanvasRenderingContext2D,
  CanvasDirection,
  CanvasFillRule,
  CanvasImageSource,
  CanvasLineCap,
  CanvasLineJoin,
  CanvasTextAlign,
  CanvasTextBaseline,
  ImageSmoothingQuality,
  CanvasGradient,
  CanvasPattern,
} from './DOMTypes';
import { MessageType, OffscreenCanvasToWorker } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { transfer } from './MutationTransfer';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { OffscreenCanvasPolyfill } from './OffscreenCanvasPolyfill';
import { Document } from './dom/Document';
import { HTMLElement } from './dom/HTMLElement';

declare var OffscreenCanvas: any;

export const deferredUpgrades = new WeakMap();

export function getOffscreenCanvasAsync<ElementType extends HTMLElement>(
  canvas: ElementType,
): Promise<{ getContext(c: '2d'): CanvasRenderingContext2D }> {
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
      const deferred = { resolve, reject };
      deferredUpgrades.set(canvas, deferred);
    } else {
      addEventListener('message', messageHandler);
      transfer(canvas.ownerDocument as Document, [TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE, canvas[TransferrableKeys.index]]);
    }
  });
}

export class CanvasRenderingContext2DImplementation<ElementType extends HTMLElement> implements CanvasRenderingContext2D {
  private calls = [] as { fnName: string; args: any[]; setter: boolean }[];
  private implementation: CanvasRenderingContext2D;
  private upgraded = false;
  private canvasElement: ElementType;

  // TODO: This should only exist in testing environment
  public goodOffscreenPromise: Promise<void>;

  constructor(canvas: ElementType) {
    this.canvasElement = canvas;

    if (typeof OffscreenCanvas === 'undefined') {
      this.implementation = new OffscreenCanvasPolyfill<ElementType>(canvas).getContext('2d');
      this.upgraded = true;
    } else {
      this.implementation = new OffscreenCanvas(0, 0).getContext('2d');
      this.goodOffscreenPromise = getOffscreenCanvasAsync(this.canvasElement).then(instance => {
        this.implementation = instance.getContext('2d');
        this.upgraded = true;
        this.callQueuedCalls();
      });
    }
  }

  private callQueuedCalls() {
    for (const call of this.calls) {
      if (call.setter) {
        if (call.args.length != 1) {
          throw new Error('Attempting to set property with wrong number of arguments.');
        }
        (this.implementation as any)[call.fnName] = call.args[0];
      } else {
        (this.implementation as any)[call.fnName](...call.args);
      }
    }
  }

  private delegate(fnName: string, fnArgs: any[], isSetter: boolean) {
    let returnValue;
    if (isSetter) {
      (this.implementation as any)[fnName] = fnArgs[0];
    } else {
      returnValue = (this.implementation as any)[fnName](...fnArgs);
    }
    if (!this.upgraded) {
      this.calls.push({ fnName, args: fnArgs, setter: isSetter });
    }
    return returnValue;
  }

  /* DRAWING RECTANGLES */
  clearRect(x: number, y: number, width: number, height: number): void {
    this.delegate('clearRect', [...arguments], false);
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    this.delegate('fillRect', [...arguments], false);
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    this.delegate('strokeRect', [...arguments], false);
  }

  /* DRAWING TEXT */
  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    this.delegate('fillText', [...arguments], false);
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    this.delegate('strokeText', [...arguments], false);
  }

  measureText(text: string): TextMetrics {
    return this.delegate('measureText', [...arguments], false);
  }

  /* LINE STYLES */
  set lineWidth(value: number) {
    this.delegate('lineWidth', [...arguments], true);
  }

  set lineCap(value: CanvasLineCap) {
    this.delegate('lineCap', [...arguments], true);
  }

  set lineJoin(value: CanvasLineJoin) {
    this.delegate('lineJoin', [...arguments], true);
  }

  set miterLimit(value: number) {
    this.delegate('miterLimit', [...arguments], true);
  }

  getLineDash(): number[] {
    return this.delegate('getLineDash', [...arguments], false);
  }

  setLineDash(segments: number[]): void {
    this.delegate('setLineDash', [...arguments], false);
  }

  set lineDashOffset(value: number) {
    this.delegate('lineDashOffset', [...arguments], true);
  }

  /* TEXT STYLES */
  set font(value: string) {
    this.delegate('font', [...arguments], true);
  }

  set textAlign(value: CanvasTextAlign) {
    this.delegate('textAlign', [...arguments], true);
  }

  set textBaseline(value: CanvasTextBaseline) {
    this.delegate('textBaseline', [...arguments], true);
  }

  set direction(value: CanvasDirection) {
    this.delegate('direction', [...arguments], true);
  }

  /* FILL AND STROKE STYLES */
  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    this.delegate('fillStyle', [...arguments], true);
  }

  set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
    this.delegate('strokeStyle', [...arguments], true);
  }

  /* GRADIENTS AND PATTERNS */
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this.delegate('createLinearGradient', [...arguments], false);
  }

  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    return this.delegate('createRadialGradient', [...arguments], false);
  }

  createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null {
    return this.delegate('createPattern', [...arguments], false);
  }

  /* SHADOWS */
  set shadowBlur(value: number) {
    this.delegate('shadowBlur', [...arguments], true);
  }

  set shadowColor(value: string) {
    this.delegate('shadowColor', [...arguments], true);
  }

  set shadowOffsetX(value: number) {
    this.delegate('shadowOffsetX', [...arguments], true);
  }

  set shadowOffsetY(value: number) {
    this.delegate('shadowOffsetY', [...arguments], true);
  }

  /* PATHS */
  beginPath(): void {
    this.delegate('beginPath', [...arguments], false);
  }

  closePath(): void {
    this.delegate('closePath', [...arguments], false);
  }

  moveTo(x: number, y: number): void {
    this.delegate('moveTo', [...arguments], false);
  }

  lineTo(x: number, y: number): void {
    this.delegate('lineTo', [...arguments], false);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.delegate('bezierCurveTo', [...arguments], false);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    this.delegate('quadraticCurveTo', [...arguments], false);
  }

  // OPTIONAL ARGUMENT ATICLOCKWISE
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, antiClockwise?: boolean): void {
    this.delegate('arc', [...arguments], false);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    this.delegate('arcTo', [...arguments], false);
  }

  // OPTIONAL ARGUMENT ATICLOCKWISE
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
    this.delegate('ellipse', [...arguments], false);
  }

  rect(x: number, y: number, width: number, height: number): void {
    this.delegate('rect', [...arguments], false);
  }

  /* DRAWING PATHS */
  fill(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void {
    const args = [...arguments] as [Path2D, CanvasFillRule | undefined] | [CanvasFillRule | undefined];
    this.delegate('fill', args, false);
  }

  stroke(path?: Path2D): void {
    const args = [...arguments] as [Path2D] | [];
    this.delegate('stroke', args, false);
  }

  clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void {
    const args = [...arguments] as [Path2D, CanvasFillRule | undefined] | [CanvasFillRule | undefined];
    this.delegate('clip', args, false);
  }

  isPointInPath(pathOrX: Path2D | number, xOrY: number, yOrFillRule?: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean {
    const args = [...arguments] as [number, number, CanvasFillRule | undefined] | [Path2D, number, number, CanvasFillRule | undefined];

    return this.delegate('isPointInPath', args, false);
  }

  isPointInStroke(pathOrX: Path2D | number, xOrY: number, y?: number): boolean {
    const args = [...arguments] as [number, number] | [Path2D, number, number];
    return this.delegate('isPointInStroke', args, false);
  }

  /* TRANSFORMATIONS */
  /* Experimental *** set currentTransform(value: DOMMatrix) {
        this.implementation.currentTransform = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'currentTransform', args: [value], setter: true});
        }
    }
    */

  rotate(angle: number): void {
    this.delegate('rotate', [...arguments], false);
  }

  scale(x: number, y: number): void {
    this.delegate('scale', [...arguments], false);
  }

  translate(x: number, y: number): void {
    this.delegate('translate', [...arguments], false);
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this.delegate('transform', [...arguments], false);
  }

  setTransform(transformOrA?: DOMMatrix2DInit | number, bOrC?: number, cOrD?: number, dOrE?: number, eOrF?: number, f?: number): void {
    const args = [...arguments] as [] | [DOMMatrix2DInit] | [number, number, number, number, number, number];
    this.delegate('setTransform', args, false);
  }

  /* experimental */ resetTransform(): void {
    this.delegate('resetTransform', [...arguments], false);
  }

  /* COMPOSITING */
  set globalAlpha(value: number) {
    this.delegate('globalAlpha', [...arguments], true);
  }

  set globalCompositeOperation(value: string) {
    this.delegate('globalCompositeOperation', [...arguments], true);
  }

  /* DRAWING IMAGES */
  drawImage(image: CanvasImageSource, dx: number, dy: number): void {
    this.delegate('drawImage', [...arguments], false);
  }

  /* PIXEL MANIPULATION */
  createImageData(imagedataOrWidth: ImageData | number, height?: number): ImageData {
    const args = [...arguments] as [ImageData] | [number, number];
    return this.delegate('createImageData', args, false);
  }

  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    return this.delegate('getImageData', [...arguments], false);
  }

  putImageData(imageData: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
    this.delegate('putImageData', [...arguments], false);
  }

  /* IMAGE SMOOTHING */
  /* experimental */ set imageSmoothingEnabled(value: boolean) {
    this.delegate('imageSmoothingEnabled', [...arguments], true);
  }

  /* experimental */ set imageSmoothingQuality(value: ImageSmoothingQuality) {
    this.delegate('imageSmoothingQuality', [...arguments], true);
  }

  /* THE CANVAS STATE */
  save(): void {
    this.delegate('save', [...arguments], false);
  }

  restore(): void {
    this.delegate('restore', [...arguments], false);
  }

  // canvas property is readonly. We don't want to implement getters, but this must be here
  // in order for TypeScript to not complain (for now)
  get canvas(): ElementType {
    return this.canvasElement;
  }

  /* FILTERS */
  /* experimental */ set filter(value: string) {
    this.delegate('filter', [...arguments], true);
  }
}
