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

  getContext(c: string): CanvasRenderingContext2D {
    return this.context;
  }
}

class OffscreenCanvasRenderingContext2DPolyfill implements CanvasRenderingContext2D {
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    const stringsIdForMethodName = store('clearRect');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1, // string index, -1 if not present
        4, // Argument count
        x,
        y,
        w,
        h,
      ],
      Float32Array,
    );
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    const stringsIdForMethodName = store('fillRect');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        4, // Argument count
        x,
        y,
        w,
        h,
      ],
      Float32Array,
    );
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    const stringsIdForMethodName = store('strokeRect');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        4, // Argument count
        x,
        y,
        w,
        h,
      ],
      Float32Array,
    );
  }

  set lineWidth(val: number) {
    const stringsIdForMethodName = store('lineWidth');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.TRUE, // is setter?
        -1,
        1, // Argument count
        val,
      ],
      Float32Array,
    );
  }

  fillText(text: string, x: number, y: number) {
    const stringsIdForMethodName = store('fillText');
    const stringsIdForTextArg = store(text);

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        0,
        3, // Argument count
        stringsIdForTextArg,
        x,
        y,
      ],
      Float32Array,
    );
  }

  moveTo(x: number, y: number) {
    const stringsIdForMethodName = store('moveTo');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        2, // Argument count
        x,
        y,
      ],
      Float32Array,
    );
  }

  lineTo(x: number, y: number) {
    const stringsIdForMethodName = store('lineTo');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        2, // Argument count
        x,
        y,
      ],
      Float32Array,
    );
  }

  closePath() {
    const stringsIdForMethodName = store('closePath');

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.FALSE, // is setter?
      -1,
      0 /* Argument count */,
    ]);
  }

  stroke() {
    const stringsIdForMethodName = store('stroke');

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.FALSE, // is setter?
      -1,
      0 /* Argument count */,
    ]);
  }

  restore() {}
  save() {}
  resetTransform() {}
  rotate() {}
  transform() {}
  translate() {}
  setTransform() {}
  scale() {}
  set globalAlpha(value: number) {}
  set globalCompositeOperation(val: string) {}
  set imageSmoothingEnabled(val: boolean) {}
  set imageSmoothingQuality(val: ImageSmoothingQuality) {}
  set fillStyle(val: string) {}
  set strokeStyle(val: string) {}
  createLinearGradient(): CanvasGradient {
    return {} as CanvasGradient;
  }
  createPattern(): CanvasPattern {
    return {} as CanvasPattern;
  }
  createRadialGradient(): CanvasGradient {
    return {} as CanvasGradient;
  }
  set shadowBlur(val: number) {}
  set shadowColor(val: string) {}
  set shadowOffsetX(val: number) {}
  set shadowOffsetY(val: number) {}
  set filter(val: string) {}
  beginPath() {}
  clip() {}
  fill() {}
  isPointInPath(): boolean {
    return true;
  }
  isPointInStroke(): boolean {
    return true;
  }
  strokeText() {}
  set textAlign(val: CanvasTextAlign) {}
  set textBaseline(val: CanvasTextBaseline) {}
  measureText(): TextMetrics {
    return {} as TextMetrics;
  }
  drawImage() {}
  createImageData(): ImageData {
    return {} as ImageData;
  }
  getImageData(): ImageData {
    return {} as ImageData;
  }
  putImageData() {}
  set lineCap(val: CanvasLineCap) {}
  set lineDashOffset(val: number) {}
  set lineJoin(val: CanvasLineJoin) {}
  getLineDash(): number[] {
    return [];
  }
  setLineDash() {}
  set miterLimit(val: number) {}
  arc() {}
  arcTo() {}
  set direction(val: CanvasDirection) {}
  set font(val: string) {}
  ellipse() {}
  bezierCurveTo() {}
  rect() {}
  quadraticCurveTo() {}
}
