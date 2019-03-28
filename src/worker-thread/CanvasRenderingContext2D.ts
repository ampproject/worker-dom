import { CanvasRenderingContext2DImplementation, CanvasDirection, CanvasFillRule, CanvasImageSource, CanvasLineCap, CanvasLineJoin, CanvasTextAlign, CanvasTextBaseline, ImageSmoothingQuality, CanvasGradient, CanvasPattern } from './DOMTypes';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import { MutationRecordType } from './MutationRecord';
import { mutate } from './MutationObserver';
import { MessageType, MessageToWorker, OffscreenCanvasToWorker } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

declare var OffscreenCanvas: any;

export const deferredUpgrades = new WeakMap();

export function getOffscreenCanvasAsync(canvas: HTMLCanvasElement): Promise<{getContext(c: '2d'): CanvasRenderingContext2DImplementation}> {
    return new Promise((resolve, reject) => {
        // TODO: This should only happen in test environemnet. Otherwise, we should throw.
        if (typeof addEventListener !== 'function') {
            const deferred = { resolve, reject };
            deferredUpgrades.set(canvas, deferred);
        } else {
            addEventListener('message', ({ data }: { data: MessageToWorker }) => {
                if (data[TransferrableKeys.type] === MessageType.OFFSCREEN_CANVAS_INSTANCE) {
                    const transferredOffscreenCanvas = (data as OffscreenCanvasToWorker)[TransferrableKeys.data];
                    resolve(transferredOffscreenCanvas as {getContext(c: '2d'): CanvasRenderingContext2DImplementation});
                }
            });
            mutate({
                type: MutationRecordType.OFFSCREEN_CANVAS_INSTANCE,
                target: canvas,
            });
        }
    })
  }

export class CanvasRenderingContext2D implements CanvasRenderingContext2DImplementation {
    
    private calls = [] as {fnName: string, args: any[], setter: boolean}[];
    private implementation = (new OffscreenCanvas(0, 0) as {getContext(c: "2d"): CanvasRenderingContext2DImplementation}).getContext('2d');
    private upgraded = false;
    private canvasElement: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvasElement = canvas;

        getOffscreenCanvasAsync(this.canvasElement).then((instance) => {
            this.implementation = instance.getContext('2d');
            this.upgraded = true;

            for (const call of this.calls) {
                if (call.setter) {
                    if (call.args.length != 1) {
                        throw new Error(
                            "Attempting to set property with wrong number of arguments.");
                    }
                    (this.implementation as any)[call.fnName] = call.args[0];
                    
                } else {
                    (this.implementation as any)[call.fnName](...call.args);
                }
            }

        });
    }

    private delegate(fn: {fnName: string, fnArgs: any[], setter: boolean}) {
        let returnValue;
        if (fn.setter) {
            (this.implementation as any)[fn.fnName] = fn.fnArgs[0];
        } else {
            returnValue = (this.implementation as any)[fn.fnName](...fn.fnArgs);
        }
        if (!this.upgraded) {
            this.calls.push({fnName: fn.fnName, args: fn.fnArgs, setter: fn.setter});
        }
        return returnValue;
    }

    /* DRAWING RECTANGLES */
    clearRect(x: number, y: number, width: number, height: number): void {
        this.delegate({fnName: 'clearRect', fnArgs: [x, y, width, height], setter: false});
    }

    fillRect(x: number, y: number, width: number, height: number): void {
        this.delegate({fnName: 'fillRect', fnArgs: [x, y, width, height], setter: false});
    }

    strokeRect(x: number, y: number, width: number, height: number): void {
        this.delegate({fnName: 'strokeRect', fnArgs: [x, y, width, height], setter: false});
    }

    /* DRAWING TEXT */
    fillText(text: string, x: number, y: number): void {
        this.delegate({fnName: 'fillText', fnArgs: [text, x, y], setter: false});
    }

    strokeText(text: string, x: number, y: number): void {
        this.delegate({fnName: 'strokeText', fnArgs: [text, x, y], setter: false});
    }

    measureText(text: string): TextMetrics {
        return this.delegate({fnName: 'measureText', fnArgs: [text], setter: false});
    }

    /* LINE STYLES */
    set lineWidth(value: number) {
        this.delegate({fnName: 'lineWidth', fnArgs: [value], setter: true});
    }

    set lineCap(value: CanvasLineCap) {
        this.delegate({fnName: 'lineCap', fnArgs: [value], setter: true});
    }

    set lineJoin(value: CanvasLineJoin) {
        this.delegate({fnName: 'lineJoin', fnArgs: [value], setter: true});
    }

    set miterLimit(value: number) {
        this.delegate({fnName: 'miterLimit', fnArgs: [value], setter: true});
    }

    getLineDash(): number[] {
        return this.delegate({fnName: 'getLineDash', fnArgs: [], setter: false});
    }

    setLineDash(segments: number[]): void {
        this.delegate({fnName: 'setLineDash', fnArgs: [segments], setter: false});
    }

    set lineDashOffset(value: number) {
        this.delegate({fnName: 'lineDashOffset', fnArgs: [value], setter: true});
    }

    /* TEXT STYLES */
    set font(value: string) {
        this.delegate({fnName: 'font', fnArgs: [value], setter: true});
    }

    set textAlign(value: CanvasTextAlign) {
        this.delegate({fnName: 'textAlign', fnArgs: [value], setter: true});
    }

    set textBaseline(value: CanvasTextBaseline) {
        this.delegate({fnName: 'textBaseline', fnArgs: [value], setter: true});
    }

    set direction(value: CanvasDirection) {
        this.delegate({fnName: 'direction', fnArgs: [value], setter: true});
    }

    /* FILL AND STROKE STYLES */
    set fillStyle(value: string | CanvasGradient | CanvasPattern) {
        this.delegate({fnName: 'fillStyle', fnArgs: [value], setter: true});
    }

    set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
        this.delegate({fnName: 'strokeStyle', fnArgs: [value], setter: true});
    }

    /* GRADIENTS AND PATTERNS */
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
        return this.delegate(
            {fnName: 'createLinearGradient', fnArgs: [x0, y0, x1, y1], setter: false});
        
    }

    createRadialGradient(
        x0: number, y0: number, r0: number,  x1: number, y1: number, r1: number): CanvasGradient {
        return this.delegate({
            fnName: 'createRadialGradient', fnArgs: [x0, y0, r0, x1, y1, r1], setter: false});
    }

    createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null {
        return this.delegate({fnName: 'createPattern', fnArgs: [image, repetition], setter: false});
    }

    /* SHADOWS */
    set shadowBlur(value: number) {
        this.delegate({fnName: 'shadowBlur', fnArgs: [value], setter: true});
    }

    set shadowColor(value: string) {
        this.delegate({fnName: 'shadowColor', fnArgs: [value], setter: true});
    }

    set shadowOffsetX(value: number) {
        this.delegate({fnName: 'shadowOffsetX', fnArgs: [value], setter: true});
    }

    set shadowOffsetY(value: number) {
        this.delegate({fnName: 'shadowOffsetY', fnArgs: [value], setter: true});
    }

    /* PATHS */
    beginPath(): void {
        this.delegate({fnName: 'beginPath', fnArgs: [], setter: false});
    }

    closePath(): void {
        this.delegate({fnName: 'closePath', fnArgs: [], setter: false});
    }

    moveTo(x: number, y: number): void {
        this.delegate({fnName: 'moveTo', fnArgs: [x, y], setter: false});
    }

    lineTo(x: number, y: number): void {
        this.delegate({fnName: 'lineTo', fnArgs: [x, y], setter: false});
    }

    bezierCurveTo(
        cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
            this.delegate(
                {fnName: 'bezierCurveTo', fnArgs: [cp1x, cp1y, cp2x, cp2y, x, y], setter: false});
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.delegate({fnName: 'quadraticCurveTo', fnArgs: [cpx, cpy, x, y], setter: false});
    }

    // OPTIONAL ARGUMENT ATICLOCKWISE
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
        this.delegate(
            {fnName: 'arc', fnArgs: [x, y, radius, startAngle, endAngle], setter: false});
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.delegate({fnName: 'arcTo', fnArgs: [x1, y1, x2, y2, radius], setter: false});
    }

    // OPTIONAL ARGUMENT ATICLOCKWISE
    ellipse(
        x: number, 
        y: number, 
        radiusX: number, 
        radiusY: number, 
        rotation: number, 
        startAngle: number, 
        endAngle: number
        ): void {
            this.delegate({
                fnName: 'ellipse', 
                fnArgs: [x, y, radiusX, radiusY, rotation, startAngle, endAngle], 
                setter: false
            });
        }

    rect(x: number, y: number, width: number, height: number): void {
        this.delegate({fnName: 'rect', fnArgs: [x, y, width, height], setter: false});
    }

    /* DRAWING PATHS */
    fill(
        pathOrFillRule?: Path2D | CanvasFillRule, 
        fillRule?: CanvasFillRule): void {
            const args = [...arguments] as 
                [Path2D, CanvasFillRule | undefined] | [CanvasFillRule | undefined];
            this.delegate({fnName: 'fill', fnArgs: args, setter: false});
    }

    stroke(path?: Path2D): void {
        const args = [...arguments] as [Path2D] | [];
        this.delegate({fnName: 'stroke', fnArgs: args, setter: false});
    }

    clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void {
        const args = [...arguments] as 
                [Path2D, CanvasFillRule | undefined] | 
                [CanvasFillRule | undefined];
        this.delegate({fnName: 'clip', fnArgs: args, setter: false});
    }

    isPointInPath(pathOrX: Path2D | number, 
        xOrY: number, 
        yOrFillRule?: number | CanvasFillRule, 
        fillRule?: CanvasFillRule): boolean {

        const args = [...arguments] as [number, number, CanvasFillRule | undefined] |
                                       [Path2D, number, number, CanvasFillRule | undefined];

        return this.delegate({fnName: 'isPointInPath', fnArgs: args, setter: false});
    }

    isPointInStroke(pathOrX: Path2D | number, xOrY: number, y?: number): boolean {
        const args = [...arguments] as [number, number] | [Path2D, number, number];
        return this.delegate({fnName: 'isPointInStroke', fnArgs: args, setter: false});
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
        this.delegate({fnName: 'rotate', fnArgs: [angle], setter: false});
    }

    scale(x: number, y: number): void {
        this.delegate({fnName: 'scale', fnArgs: [x, y], setter: false});
    }

    translate(x: number, y: number): void {
        this.delegate({fnName: 'translate', fnArgs: [x, y], setter: false});
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.delegate({fnName: 'transform', fnArgs: [a, b, c, d, e, f], setter: false});
    }

    setTransform(transformOrA?: DOMMatrix2DInit | number, 
        bOrC?: number, 
        cOrD?: number, 
        dOrE?: number, 
        eOrF?: number,
        f?: number): void {
            const args = [...arguments] as [] | [DOMMatrix2DInit] |
                [number, number, number, number, number, number];

            this.delegate({fnName: 'setTransform', fnArgs: args, setter: false});
    }

    /* experimental */resetTransform(): void {
        this.delegate({fnName: 'resetTransform', fnArgs: [], setter: false});
    }

    /* COMPOSITING */
    set globalAlpha(value: number) {
        this.delegate({fnName: 'globalAlpha', fnArgs: [value], setter: true});
    }

    set globalCompositeOperation(value: string) {
        this.delegate({fnName: 'globalCompositeOperation', fnArgs: [value], setter: true});
    }

    /* DRAWING IMAGES */
    drawImage(image: CanvasImageSource, dx: number, dy: number): void {
        this.delegate({fnName: 'drawImage', fnArgs: [image, dx, dy], setter: false});
    }

    /* PIXEL MANIPULATION */
    createImageData(imagedataOrWidth: ImageData | number, widthOrHeight?: number): ImageData {
        const args = [...arguments] as [ImageData] | [number, number];
        return this.delegate({fnName: 'createImageData', fnArgs: args, setter: false});
    }

    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
        return this.delegate({fnName: 'getImageData', fnArgs: [sx, sy, sw, sh], setter: false});
    }

    putImageData(imageData: ImageData, dx: number, dy: number): void {
        this.delegate({fnName: 'putImageData', fnArgs: [imageData, dx, dy], setter: false});
    }

    /* IMAGE SMOOTHING */
    /* experimental */set imageSmoothingEnabled(value: boolean) {
        this.delegate({fnName: 'imageSmoothingEnabled', fnArgs: [value], setter: true});
    }

    /* experimental */set imageSmoothingQuality(value: ImageSmoothingQuality) {
        this.delegate({fnName: 'imageSmoothingQuality', fnArgs: [value], setter: true});
    }

    /* THE CANVAS STATE */
    save(): void {
        this.delegate({fnName: 'save', fnArgs: [], setter: false});
    }

    restore(): void {
        this.delegate({fnName: 'restore', fnArgs: [], setter: false});
    }

    // canvas property is readonly. We don't want to implement getters, but this must be here
    // in order for TypeScript to not complain (for now)
    get canvas(): HTMLCanvasElement {
        return this.canvasElement;
    }

    /* FILTERS */
    /* experimental */set filter(value: string) {
        this.delegate({fnName: 'filter', fnArgs: [value], setter: true});
    }
}
