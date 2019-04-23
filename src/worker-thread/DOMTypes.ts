import { HTMLElement } from './dom/HTMLElement';

/** The CanvasRenderingContext2D interface, part of the Canvas API, provides the 2D rendering context for the drawing surface of a <canvas> element. It is used for drawing shapes, text, images, and other objects. */
export interface CanvasRenderingContext2D
  extends CanvasState,
    CanvasTransform,
    CanvasCompositing,
    CanvasImageSmoothing,
    CanvasFillStrokeStyles,
    CanvasShadowStyles,
    CanvasFilters,
    CanvasRect,
    CanvasDrawPath,
    CanvasText,
    CanvasDrawImage,
    CanvasImageData,
    CanvasPathDrawingStyles,
    CanvasTextDrawingStyles,
    CanvasPath {
  readonly canvas: HTMLElement;
}

declare var CanvasRenderingContext2D: {
  prototype: CanvasRenderingContext2D;
  new (): CanvasRenderingContext2D;
};

interface CanvasDrawImage {
  drawImage(image: CanvasImageSource, dx: number, dy: number): void;
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
}

interface CanvasImageData {
  createImageData(sw: number, sh: number): ImageData;
  createImageData(imagedata: ImageData): ImageData;
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
  putImageData(imagedata: ImageData, dx: number, dy: number): void;
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
}

interface CanvasPathDrawingStyles {
  lineCap: CanvasLineCap;
  lineDashOffset: number;
  lineJoin: CanvasLineJoin;
  lineWidth: number;
  miterLimit: number;
  getLineDash(): number[];
  setLineDash(segments: number[]): void;
}

interface CanvasState {
  restore(): void;
  save(): void;
}

interface CanvasText {
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
  measureText(text: string): TextMetrics;
  strokeText(text: string, x: number, y: number, maxWidth?: number): void;
}

interface CanvasTextDrawingStyles {
  direction: CanvasDirection;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
}

interface CanvasTransform {
  // Not defined for OffscreenCanvas
  // getTransform(): DOMMatrix;

  resetTransform(): void;
  rotate(angle: number): void;
  scale(x: number, y: number): void;
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  setTransform(transform?: DOMMatrix2DInit): void;
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  translate(x: number, y: number): void;
}

interface CanvasCompositing {
  globalAlpha: number;
  globalCompositeOperation: string;
}

interface CanvasImageSmoothing {
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
}

interface CanvasFillStrokeStyles {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
}

interface CanvasShadowStyles {
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

interface CanvasFilters {
  filter: string;
}

interface CanvasRect {
  clearRect(x: number, y: number, w: number, h: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
}

interface CanvasDrawPath {
  beginPath(): void;
  clip(fillRule?: CanvasFillRule): void;
  clip(path: Path2D, fillRule?: CanvasFillRule): void;
  fill(fillRule?: CanvasFillRule): void;
  fill(path: Path2D, fillRule?: CanvasFillRule): void;
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
  isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
  isPointInStroke(x: number, y: number): boolean;
  isPointInStroke(path: Path2D, x: number, y: number): boolean;
  stroke(): void;
  stroke(path: Path2D): void;
}

// These are not supported by OffscreenCanvas
/*
interface CanvasUserInterface {
    drawFocusIfNeeded(element: Element): void;
    drawFocusIfNeeded(path: Path2D, element: Element): void;
    scrollPathIntoView(): void;
    scrollPathIntoView(path: Path2D): void;
}
*/

export interface ImageBitmap {
  /**
   * Returns the intrinsic height of the image, in CSS
   * pixels.
   */
  readonly height: number;
  /**
   * Returns the intrinsic width of the image, in CSS
   * pixels.
   */
  readonly width: number;
  /**
   * Releases imageBitmap's underlying bitmap data.
   */
  close(): void;
}

declare var ImageBitmap: {
  prototype: ImageBitmap;
  new (): ImageBitmap;
};

export type CanvasDirection = 'ltr' | 'rtl' | 'inherit';
export type CanvasFillRule = 'nonzero' | 'evenodd';
export type CanvasImageSource = ImageBitmap;
export type CanvasLineCap = 'butt' | 'round' | 'square';
export type CanvasLineJoin = 'round' | 'bevel' | 'miter';
export type CanvasTextAlign = 'start' | 'end' | 'left' | 'right' | 'center';
export type CanvasTextBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
export type ImageSmoothingQuality = 'low' | 'medium' | 'high';

/** The CanvasGradient interface represents an opaque object describing a gradient.
 * It is returned by the methods CanvasRenderingContext2D.createLinearGradient() or
 * CanvasRenderingContext2D.createRadialGradient(). */
export interface CanvasGradient {
  /**
   * Adds a color stop with the given color to the gradient at the given offset. 0.0 is the offset
   * at one end of the gradient, 1.0 is the offset at the other end.
   * Throws an 'IndexSizeError' DOMException if the offset
   * is out of range. Throws a 'SyntaxError' DOMException if
   * the color cannot be parsed.
   */
  addColorStop(offset: number, color: string): void;
}

declare var CanvasGradient: {
  prototype: CanvasGradient;
  new (): CanvasGradient;
};

/** The CanvasPattern interface represents an opaque object describing a pattern, based on an image,
 *  a canvas, or a video, created by the CanvasRenderingContext2D.createPattern() method. */
export interface CanvasPattern {
  /**
   * Sets the transformation matrix that will be used when rendering the pattern during a fill or
   * stroke painting operation.
   */
  setTransform(transform?: DOMMatrix2DInit): void;
}

declare var CanvasPattern: {
  prototype: CanvasPattern;
  new (): CanvasPattern;
};
