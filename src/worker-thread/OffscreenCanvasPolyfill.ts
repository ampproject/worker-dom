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

  restore() {
    const stringsIdForMethodName = store('restore');

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.FALSE, // is setter?
      -1,
      0 /* Argument count */,
    ]);
  }

  save() {
    const stringsIdForMethodName = store('save');

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.FALSE, // is setter?
      -1,
      0 /* Argument count */,
    ]);
  }

  resetTransform() {
    const stringsIdForMethodName = store('resetTransform');

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.FALSE, // is setter?
      -1,
      0 /* Argument count */,
    ]);
  }

  rotate(angle: number) {
    const stringsIdForMethodName = store('rotate');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        1 /* Argument count */,
        angle,
      ],
      Float32Array,
    );
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    const stringsIdForMethodName = store('transform');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        6 /* Argument count */,
        a,
        b,
        c,
        d,
        e,
        f,
      ],
      Float32Array,
    );
  }

  translate(x: number, y: number) {
    const stringsIdForMethodName = store('translate');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        2 /* Argument count */,
        x,
        y,
      ],
      Float32Array,
    );
  }

  scale(x: number, y: number) {
    const stringsIdForMethodName = store('scale');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        2 /* Argument count */,
        x,
        y,
      ],
      Float32Array,
    );
  }

  set globalAlpha(value: number) {
    const stringsIdForMethodName = store('globalAlpha');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.TRUE, // is setter?
        -1,
        1 /* Argument count */,
        value,
      ],
      Float32Array,
    );
  }

  set globalCompositeOperation(value: string) {
    const stringsIdForMethodName = store('globalCompositeOperation');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set imageSmoothingQuality(value: ImageSmoothingQuality) {
    const stringsIdForMethodName = store('imageSmoothingQuality');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set fillStyle(value: string) {
    const stringsIdForMethodName = store('fillStyle');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set strokeStyle(value: string) {
    const stringsIdForMethodName = store('strokeStyle');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set shadowBlur(value: number) {
    const stringsIdForMethodName = store('shadowBlur');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.TRUE, // is setter?
        -1,
        1 /* Argument count */,
        value,
      ],
      Float32Array,
    );
  }

  set shadowColor(value: string) {
    const stringsIdForMethodName = store('shadowColor');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set shadowOffsetX(value: number) {
    const stringsIdForMethodName = store('shadowOffsetX');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.TRUE, // is setter?
        -1,
        1 /* Argument count */,
        value,
      ],
      Float32Array,
    );
  }

  set shadowOffsetY(value: number) {
    const stringsIdForMethodName = store('shadowOffsetY');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.TRUE, // is setter?
        -1,
        1 /* Argument count */,
        value,
      ],
      Float32Array,
    );
  }

  set filter(value: string) {
    const stringsIdForMethodName = store('filter');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  beginPath() {
    const stringsIdForMethodName = store('beginPath');

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.FALSE, // is setter?
      -1,
      0 /* Argument count */,
    ]);
  }

  strokeText(text: string, x: number, y: number) {
    const stringsIdForMethodName = store('strokeText');
    const stringsIdForTextArg = store(text);

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        0,
        3 /* Argument count */,
        stringsIdForTextArg,
        x,
        y,
      ],
      Float32Array,
    );
  }

  set textAlign(value: CanvasTextAlign) {
    const stringsIdForMethodName = store('textAlign');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set textBaseline(value: CanvasTextBaseline) {
    const stringsIdForMethodName = store('filter');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set lineCap(value: CanvasLineCap) {
    const stringsIdForMethodName = store('lineCap');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set lineDashOffset(value: number) {
    const stringsIdForMethodName = store('textAlign');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.TRUE, // is setter?
        -1,
        1 /* Argument count */,
        value,
      ],
      Float32Array,
    );
  }

  set lineJoin(value: CanvasLineJoin) {
    const stringsIdForMethodName = store('lineJoin');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set miterLimit(value: number) {
    const stringsIdForMethodName = store('miterLimit');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.TRUE, // is setter?
        -1,
        1 /* Argument count */,
        value,
      ],
      Float32Array,
    );
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const stringsIdForMethodName = store('arc');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        5 /* Argument count */,
        x,
        y,
        radius,
        startAngle,
        endAngle,
      ],
      Float32Array,
    );
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    const stringsIdForMethodName = store('arcTo');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        5 /* Argument count */,
        x1,
        y1,
        x2,
        y2,
        radius,
      ],
      Float32Array,
    );
  }

  set direction(value: CanvasDirection) {
    const stringsIdForMethodName = store('direction');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  set font(value: string) {
    const stringsIdForMethodName = store('font');
    const stringsIdForTextArg = store(value);

    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
      this.canvas[TransferrableKeys.index],
      stringsIdForMethodName,
      NumericBoolean.TRUE, // is setter?
      0,
      1 /* Argument count */,
      stringsIdForTextArg,
    ]);
  }

  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number) {
    const stringsIdForMethodName = store('ellipse');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        7 /* Argument count */,
        x,
        y,
        radiusX,
        radiusY,
        rotation,
        startAngle,
        endAngle,
      ],
      Float32Array,
    );
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    const stringsIdForMethodName = store('bezierCurveTo');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        6 /* Argument count */,
        cp1x,
        cp1y,
        cp2x,
        cp2y,
        x,
        y,
      ],
      Float32Array,
    );
  }

  rect(x: number, y: number, width: number, height: number) {
    const stringsIdForMethodName = store('rect');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        4 /* Argument count */,
        x,
        y,
        width,
        height,
      ],
      Float32Array,
    );
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    const stringsIdForMethodName = store('quadraticCurveTo');

    transfer(
      this.canvas.ownerDocument as Document,
      [
        TransferrableMutationType.OFFSCREEN_CONTEXT_CALL,
        this.canvas[TransferrableKeys.index],
        stringsIdForMethodName,
        NumericBoolean.FALSE, // is setter?
        -1,
        4 /* Argument count */,
        cpx,
        cpy,
        x,
        y,
      ],
      Float32Array,
    );
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
