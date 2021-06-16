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
} from './CanvasTypes';
import { MessageType, OffscreenCanvasToWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { transfer } from '../MutationTransfer';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { OffscreenCanvasPolyfill } from './OffscreenCanvasPolyfill';
import { Document } from '../dom/Document';
import { HTMLElement } from '../dom/HTMLElement';
import { FakeNativeCanvasPattern } from './FakeNativeCanvasPattern';
import { retrieveImageBitmap } from './canvas-utils';
import { HTMLCanvasElement } from '../dom/HTMLCanvasElement';

export const deferredUpgrades = new WeakMap();

/**
 * Delegates all CanvasRenderingContext2D calls, either to an OffscreenCanvas or a polyfill
 * (depending on whether it is supported).
 */
export class CanvasRenderingContext2DShim<ElementType extends HTMLElement> implements CanvasRenderingContext2D {
  private queue = [] as { fnName: string; args: any[]; isSetter: boolean }[];
  private implementation: CanvasRenderingContext2D;
  private upgraded = false;
  private canvasElement: ElementType;
  private polyfillUsed: boolean;

  // createPattern calls need to retrieve an ImageBitmap from the main-thread. Since those can
  // happen subsequently, we must keep track of these to avoid reentrancy problems.
  private unresolvedCalls = 0;
  private goodImplementation: CanvasRenderingContext2D;

  constructor(canvas: ElementType) {
    this.canvasElement = canvas;
    const OffscreenCanvas = canvas.ownerDocument.defaultView.OffscreenCanvas;

    // If the browser does not support OffscreenCanvas, use polyfill
    if (typeof OffscreenCanvas === 'undefined') {
      this.implementation = new OffscreenCanvasPolyfill<ElementType>(canvas).getContext('2d');
      this.upgraded = true;
      this.polyfillUsed = true;
    }

    // If the browser supports OffscreenCanvas:
    // 1. Use un-upgraded (not auto-synchronized) version for all calls performed immediately after
    // creation. All calls will be queued to call on upgraded version after.
    // 2. Retrieve an auto-synchronized OffscreenCanvas from the main-thread and call all methods
    // in the queue.
    else {
      this.implementation = new OffscreenCanvas(0, 0).getContext('2d');
      this.getOffscreenCanvasAsync(this.canvasElement);
      this.polyfillUsed = false;
    }
  }

  /**
   * Retrieves auto-synchronized version of an OffscreenCanvas from the main-thread.
   * @param canvas HTMLCanvasElement associated with this context.
   */
  private getOffscreenCanvasAsync(canvas: ElementType): Promise<void> {
    this.unresolvedCalls++;

    const deferred: {
      resolve?: (value?: {} | PromiseLike<{}>) => void;
      upgradePromise?: Promise<void>;
    } = {};
    const document = this.canvasElement.ownerDocument;
    const isTestMode = !document.addGlobalEventListener;

    const upgradePromise = new Promise((resolve) => {
      const messageHandler = ({ data }: { data: OffscreenCanvasToWorker }) => {
        if (
          data[TransferrableKeys.type] === MessageType.OFFSCREEN_CANVAS_INSTANCE &&
          data[TransferrableKeys.target][0] === canvas[TransferrableKeys.index]
        ) {
          document.removeGlobalEventListener('message', messageHandler);
          const transferredOffscreenCanvas = (data as OffscreenCanvasToWorker)[TransferrableKeys.data];
          resolve(
            transferredOffscreenCanvas as {
              getContext(c: '2d'): CanvasRenderingContext2D;
            },
          );
        }
      };

      if (!document.addGlobalEventListener) {
        if (isTestMode) {
          deferred.resolve = resolve;
        } else {
          throw new Error('addGlobalEventListener is not defined.');
        }
      } else {
        document.addGlobalEventListener('message', messageHandler);
        transfer(canvas.ownerDocument as Document, [TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE, canvas[TransferrableKeys.index]]);
      }
    }).then((instance: { getContext(c: '2d'): CanvasRenderingContext2D }) => {
      this.goodImplementation = instance.getContext('2d');
      this.maybeUpgradeImplementation();
    });

    if (isTestMode) {
      deferred.upgradePromise = upgradePromise;
      deferredUpgrades.set(canvas, deferred);
    }

    return upgradePromise;
  }

  /**
   * Degrades the underlying context implementation and adds to the unresolved call count.
   */
  private degradeImplementation() {
    this.upgraded = false;
    const OffscreenCanvas = this.canvasElement.ownerDocument.defaultView.OffscreenCanvas;
    this.implementation = new OffscreenCanvas(0, 0).getContext('2d');
    this.unresolvedCalls++;
  }

  /**
   * Will upgrade the underlying context implementation if no more unresolved calls remain.
   */
  private maybeUpgradeImplementation() {
    this.unresolvedCalls--;
    if (this.unresolvedCalls === 0) {
      this.implementation = this.goodImplementation;
      this.upgraded = true;
      this.flushQueue();
    }
  }

  private flushQueue() {
    for (const call of this.queue) {
      if (call.isSetter) {
        (this as any)[call.fnName] = call.args[0];
      } else {
        (this as any)[call.fnName](...call.args);
      }
    }
    this.queue.length = 0;
  }

  private delegateFunc(name: string, args: any[]) {
    const returnValue = (this.implementation as any)[name](...args);
    if (!this.upgraded) {
      this.queue.push({ fnName: name, args, isSetter: false });
    }
    return returnValue;
  }

  private delegateSetter(name: string, args: any[]) {
    (this.implementation as any)[name] = args[0];
    if (!this.upgraded) {
      this.queue.push({ fnName: name, args, isSetter: true });
    }
  }

  private delegateGetter(name: string) {
    return (this.implementation as any)[name];
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

  /* LINE STYLES */
  set lineWidth(value: number) {
    this.delegateSetter('lineWidth', [...arguments]);
  }

  get lineWidth(): number {
    return this.delegateGetter('lineWidth');
  }

  set lineCap(value: CanvasLineCap) {
    this.delegateSetter('lineCap', [...arguments]);
  }

  get lineCap(): CanvasLineCap {
    return this.delegateGetter('lineCap');
  }

  set lineJoin(value: CanvasLineJoin) {
    this.delegateSetter('lineJoin', [...arguments]);
  }

  get lineJoin(): CanvasLineJoin {
    return this.delegateGetter('lineJoin');
  }

  set miterLimit(value: number) {
    this.delegateSetter('miterLimit', [...arguments]);
  }

  get miterLimit(): number {
    return this.delegateGetter('miterLimit');
  }

  getLineDash(): number[] {
    return this.delegateFunc('getLineDash', [...arguments]);
  }

  setLineDash(segments: number[]): void {
    this.delegateFunc('setLineDash', [...arguments]);
  }

  set lineDashOffset(value: number) {
    this.delegateSetter('lineDashOffset', [...arguments]);
  }

  get lineDashOffset(): number {
    return this.delegateGetter('lineDashOffset');
  }

  /* TEXT STYLES */
  set font(value: string) {
    this.delegateSetter('font', [...arguments]);
  }

  get font(): string {
    return this.delegateGetter('font');
  }

  set textAlign(value: CanvasTextAlign) {
    this.delegateSetter('textAlign', [...arguments]);
  }

  get textAlign(): CanvasTextAlign {
    return this.delegateGetter('textAlign');
  }

  set textBaseline(value: CanvasTextBaseline) {
    this.delegateSetter('textBaseline', [...arguments]);
  }

  get textBaseline(): CanvasTextBaseline {
    return this.delegateGetter('textBaseline');
  }

  set direction(value: CanvasDirection) {
    this.delegateSetter('direction', [...arguments]);
  }

  get direction(): CanvasDirection {
    return this.delegateGetter('direction');
  }

  /* FILL AND STROKE STYLES */
  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    // 1. Native pattern instances given to the user hold the 'real' pattern as their implementation prop.
    // 2. Pattern must be upgraded, otherwise an undefined 'implementation' will be queued instead of the wrapper object.
    if (value instanceof FakeNativeCanvasPattern && this.upgraded) {
      // This case occurs only when an un-upgraded pattern is passed into a different (already
      // upgraded) canvas context.
      if (!value[TransferrableKeys.patternUpgraded]) {
        this.queue.push({ fnName: 'fillStyle', args: [value], isSetter: true });

        this.degradeImplementation();
        value[TransferrableKeys.patternUpgradePromise].then(() => {
          this.maybeUpgradeImplementation();
        });
      } else {
        this.delegateSetter('fillStyle', [value[TransferrableKeys.patternImplementation]]);
      }
      // Any other case does not require special handling.
    } else {
      this.delegateSetter('fillStyle', [...arguments]);
    }
  }

  get fillStyle(): string | CanvasGradient | CanvasPattern {
    return this.delegateGetter('fillStyle');
  }

  set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
    // 1. Native pattern instances given to the user hold the 'real' pattern as their implementation prop.
    // 2. Pattern must be upgraded, otherwise an undefined 'implementation' could be queued instead of the wrapper object.
    if (value instanceof FakeNativeCanvasPattern && this.upgraded) {
      // This case occurs only when an un-upgraded pattern is passed into a different (already
      // upgraded) canvas context.
      if (!value[TransferrableKeys.patternUpgraded]) {
        this.queue.push({
          fnName: 'strokeStyle',
          args: [value],
          isSetter: true,
        });

        this.degradeImplementation();
        value[TransferrableKeys.patternUpgradePromise].then(() => {
          this.maybeUpgradeImplementation();
        });
      } else {
        this.delegateSetter('strokeStyle', [value[TransferrableKeys.patternImplementation]]);
      }

      // Any other case does not require special handling.
    } else {
      this.delegateSetter('strokeStyle', [...arguments]);
    }
  }

  get strokeStyle(): string | CanvasGradient | CanvasPattern {
    return this.delegateGetter('strokeStyle');
  }

  /* GRADIENTS AND PATTERNS */
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this.delegateFunc('createLinearGradient', [...arguments]);
  }

  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    return this.delegateFunc('createRadialGradient', [...arguments]);
  }

  createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null {
    const ImageBitmap = this.canvasElement.ownerDocument.defaultView.ImageBitmap;

    // Only HTMLElement image sources require special handling. ImageBitmap is OK to use.
    if (this.polyfillUsed || image instanceof ImageBitmap) {
      return this.delegateFunc('createPattern', [...arguments]);
    } else {
      // Degrade the underlying implementation because we don't want calls on the real one until
      // after pattern is retrieved
      this.degradeImplementation();

      const fakePattern = new FakeNativeCanvasPattern<ElementType>();
      fakePattern[TransferrableKeys.retrieveCanvasPattern](this.canvas, image, repetition).then(() => {
        this.maybeUpgradeImplementation();
      });

      return fakePattern;
    }
  }

  /* DRAWING IMAGES */
  drawImage(image: CanvasImageSource, dx: number, dy: number): void {
    const ImageBitmap = this.canvasElement.ownerDocument.defaultView.ImageBitmap;

    // Only HTMLElement image sources require special handling. ImageBitmap is OK to use.
    if (this.polyfillUsed || image instanceof ImageBitmap) {
      this.delegateFunc('drawImage', [...arguments]);
    } else {
      // Queue the drawImage call to make sure it gets called in correct order
      const args = [] as any[];
      this.queue.push({ fnName: 'drawImage', args, isSetter: false });

      // Degrade the underlying implementation because we don't want calls on the real one
      // until after the ImageBitmap is received.
      this.degradeImplementation();

      // Retrieve an ImageBitmap from the main-thread with the same image as the input image
      retrieveImageBitmap(image as any, (this.canvas as unknown) as HTMLCanvasElement)
        // Then call the actual method with the retrieved ImageBitmap
        .then((instance: ImageBitmap) => {
          args.push(instance, dx, dy);
          this.maybeUpgradeImplementation();
        });
    }
  }

  /* SHADOWS */
  set shadowBlur(value: number) {
    this.delegateSetter('shadowBlur', [...arguments]);
  }

  get shadowBlur(): number {
    return this.delegateGetter('shadowBlur');
  }

  set shadowColor(value: string) {
    this.delegateSetter('shadowColor', [...arguments]);
  }

  get shadowColor(): string {
    return this.delegateGetter('shadowColor');
  }

  set shadowOffsetX(value: number) {
    this.delegateSetter('shadowOffsetX', [...arguments]);
  }

  get shadowOffsetX(): number {
    return this.delegateGetter('shadowOffsetX');
  }

  set shadowOffsetY(value: number) {
    this.delegateSetter('shadowOffsetY', [...arguments]);
  }

  get shadowOffsetY(): number {
    return this.delegateGetter('shadowOffsetY');
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

  /* experimental */ resetTransform(): void {
    this.delegateFunc('resetTransform', [...arguments]);
  }

  /* COMPOSITING */
  set globalAlpha(value: number) {
    this.delegateSetter('globalAlpha', [...arguments]);
  }

  get globalAlpha(): number {
    return this.delegateGetter('globalAlpha');
  }

  set globalCompositeOperation(value: string) {
    this.delegateSetter('globalCompositeOperation', [...arguments]);
  }

  get globalCompositeOperation(): string {
    return this.delegateGetter('globalCompositeOperation');
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

  /* IMAGE SMOOTHING */
  /* experimental */ set imageSmoothingEnabled(value: boolean) {
    this.delegateSetter('imageSmoothingEnabled', [...arguments]);
  }

  /* experimental */ get imageSmoothingEnabled(): boolean {
    return this.delegateGetter('imageSmoothingEnabled');
  }

  /* experimental */ set imageSmoothingQuality(value: ImageSmoothingQuality) {
    this.delegateSetter('imageSmoothingQuality', [...arguments]);
  }

  /* experimental */ get imageSmoothingQuality(): ImageSmoothingQuality {
    return this.delegateGetter('imageSmoothingQuality');
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

  /* FILTERS */
  /* experimental */ set filter(value: string) {
    this.delegateSetter('filter', [...arguments]);
  }

  /* experimental */ get filter(): string {
    return this.delegateGetter('filter');
  }
}
