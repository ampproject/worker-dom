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

    /* DRAWING RECTANGLES */

    clearRect(x: number, y: number, width: number, height: number): void {
        this.implementation.clearRect(x, y, width, height);
        if (!this.upgraded) {
            this.calls.push({fnName: 'clearRect', args: [x, y, width, height], setter: false});
        } 
    }

    fillRect(x: number, y: number, width: number, height: number): void {
        this.implementation.fillRect(x, y, width, height);
        if (!this.upgraded) {
            this.calls.push({fnName: 'fillRect', args: [x, y, width, height], setter: false});
        }
    }

    strokeRect(x: number, y: number, width: number, height: number): void {
        this.implementation.strokeRect(x, y, width, height);
        if (!this.upgraded) {
            this.calls.push({fnName: 'strokeRect', args: [x, y, width, height], setter: false});
        }
    }

    /* DRAWING TEXT */
    fillText(text: string, x: number, y: number): void {
        this.implementation.fillText(text, x, y);
        if (!this.upgraded) {
            this.calls.push({fnName: 'fillText', args: [text, x, y], setter: false});
        }
    }

    strokeText(text: string, x: number, y: number): void {
        this.implementation.strokeText(text, x, y);
        if (!this.upgraded) {
            this.calls.push({fnName: 'strokeText', args: [text, x, y], setter: false});
        }
    }

    measureText(text: string): TextMetrics {
        const metrics = this.implementation.measureText(text);
        if (!this.upgraded) {
            this.calls.push({fnName: 'measureText', args: [text], setter: false});
        }
        return metrics;
    }

    /* LINE STYLES */

    set lineWidth(value: number) {
        this.implementation.lineWidth = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'lineWidth', args: [value], setter: true});
        }
    }

    set lineCap(value: CanvasLineCap) {
        this.implementation.lineCap = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'lineCap', args: [value], setter: true});
        }
    }

    set lineJoin(value: CanvasLineJoin) {
        this.implementation.lineJoin = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'lineJoin', args: [value], setter: true});
        }
    }

    set miterLimit(value: number) {
        this.implementation.miterLimit = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'miterLimit', args: [value], setter: true});
        }
    }

    getLineDash(): number[] {
        const lineDash = this.implementation.getLineDash();
        if (!this.upgraded) {
            this.calls.push({fnName: 'getLineDash', args: [], setter: false});
        }
        return lineDash;
    }

    setLineDash(segments: number[]): void {
        this.implementation.setLineDash(segments);
        if (!this.upgraded) {
            // setter flag must be set to false since it is not a traditional setter
            this.calls.push({fnName: 'setLineDash', args: [segments], setter: false});
        }
    }

    set lineDashOffset(value: number) {
        this.implementation.lineDashOffset = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'lineDashOffset', args: [value], setter: true});
        }
    }

    /* TEXT STYLES */
    set font(value: string) {
        this.implementation.font = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'font', args: [value], setter: true});
        }
    }

    set textAlign(value: CanvasTextAlign) {
        this.implementation.textAlign = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'textAlign', args: [value], setter: true});
        }
    }

    set textBaseline(value: CanvasTextBaseline) {
        this.implementation.textBaseline = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'textBaseline', args: [value], setter: true});
        }
    }

    set direction(value: CanvasDirection) {
        this.implementation.direction = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'direction', args: [value], setter: true});
        }
    }

    /* FILL AND STROKE STYLES */
    set fillStyle(value: string | CanvasGradient | CanvasPattern) {
        this.implementation.fillStyle = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'fillStyle', args: [value], setter: true});
        }
    }

    set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
        this.implementation.strokeStyle = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'strokeStyle', args: [value], setter: true});
        }
    }

    /* GRADIENTS AND PATTERNS */
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
        const gradient = this.implementation.createLinearGradient(x0, y0, x1, y1);
        if (!this.upgraded) {
            this.calls.push(
                {fnName: 'createLinearGradient', args: [x0, y0, x1, y1], setter: false});
        }
        return gradient;
    }

    createRadialGradient(
        x0: number, y0: number, r0: number,  x1: number, y1: number, r1: number): CanvasGradient {
        const gradient = this.implementation.createRadialGradient(x0, y0, r0, x1, y1, r1);
        if (!this.upgraded) {
            this.calls.push({
                fnName: 'createRadialGradient', args: [x0, y0, r0, x1, y1, r1], setter: false});
        }
        return gradient;
    }

    createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null {
        const pattern = this.implementation.createPattern(image, repetition);
        if (!this.upgraded) {
            this.calls.push({fnName: 'createPattern', args: [image, repetition], setter: false});
        }
        return pattern;
    }

    /* SHADOWS */
    set shadowBlur(value: number) {
        this.implementation.shadowBlur = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'shadowBlur', args: [value], setter: true});
        }
    }

    set shadowColor(value: string) {
        this.implementation.shadowColor = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'shadowColor', args: [value], setter: true});
        }
    }

    set shadowOffsetX(value: number) {
        this.implementation.shadowOffsetX = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'shadowOffsetX', args: [value], setter: true});
        }
    }

    set shadowOffsetY(value: number) {
        this.implementation.shadowOffsetY = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'shadowOffsetY', args: [value], setter: true});
        }
    }

    /* PATHS */
    beginPath(): void {
        this.implementation.beginPath;
        if (!this.upgraded) {
            this.calls.push({fnName: 'beginPath', args: [], setter: false});
        }
    }

    closePath(): void {
        this.implementation.closePath;
        if (!this.upgraded) {
            this.calls.push({fnName: 'closePath', args: [], setter: false});
        }
    }

    moveTo(x: number, y: number): void {
        this.implementation.moveTo(x, y);
        if (!this.upgraded) {
            this.calls.push({fnName: 'moveTo', args: [x, y], setter: false});
        }
    }

    lineTo(x: number, y: number): void {
        this.implementation.lineTo(x, y);
        if (!this.upgraded) {
            this.calls.push({fnName: 'lineTo', args: [x, y], setter: false});
        }
    }

    bezierCurveTo(
        cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
            this.implementation.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            if (!this.upgraded) {
                this.calls.push(
                    {fnName: 'bezierCurveTo', args: [cp1x, cp1y, cp2x, cp2y, x, y], setter: false});
            }
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.implementation.quadraticCurveTo(cpx, cpy, x, y);
        if (!this.upgraded) {
            this.calls.push({fnName: 'quadraticCurveTo', args: [cpx, cpy, x, y], setter: false});
        }
    }

    // OPTIONAL ARGUMENT ATICLOCKWISE
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
        this.implementation.arc(x, y, radius, startAngle, endAngle);
        if (!this.upgraded) {
            this.calls.push(
                {fnName: 'arc', args: [x, y, radius, startAngle, endAngle], setter: false});
        }
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.implementation.arcTo(x1, y1, x2, y2, radius);
        if (!this.upgraded) {
            this.calls.push({fnName: 'arcTo', args: [x1, y1, x2, y2, radius], setter: false});
        }
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
            this.implementation.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
            if (!this.upgraded) {
                this.calls.push({
                    fnName: 'ellipse', 
                    args: [x, y, radiusX, radiusY, rotation, startAngle, endAngle], 
                    setter: false
                });
            }
        }

    rect(x: number, y: number, width: number, height: number): void {
        this.implementation.rect(x, y, width, height);
        if (!this.upgraded) {
            this.calls.push({fnName: 'rect', args: [x, y, width, height], setter: false});
        }
    }

    /* DRAWING PATHS */

    fill(
        pathOrFillRule?: Path2D | CanvasFillRule, 
        fillRule?: CanvasFillRule): void {
            const args = [...arguments] as 
                [Path2D, CanvasFillRule | undefined] | [CanvasFillRule | undefined];

            this.implementation.fill.apply(this.implementation, args);
            if (!this.upgraded) {
                this.calls.push({fnName: 'fill', args, setter: false});
            }
    }

    stroke(path?: Path2D): void {
        const args = [...arguments] as [Path2D] | [];
        this.implementation.stroke.apply(this.implementation, args);
        
        if (!this.upgraded) {
            this.calls.push({fnName: 'stroke', args, setter: false});
        }
    }

    clip(pathOrFillRule?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): void {
        const args = [...arguments] as 
                [Path2D, CanvasFillRule | undefined] | 
                [CanvasFillRule | undefined];

        this.implementation.clip.apply(this.implementation, args);
        if (!this.upgraded) {
            this.calls.push({fnName: 'clip', args, setter: false});
        }
    }

    isPointInPath(pathOrX: Path2D | number, 
        xOrY: number, 
        yOrFillRule?: number | CanvasFillRule, 
        fillRule?: CanvasFillRule): boolean {

        const args = [...arguments] as [number, number, CanvasFillRule | undefined] |
                                       [Path2D, number, number, CanvasFillRule | undefined];

        const isPointInPath = this.implementation.isPointInPath.apply(this.implementation, args);
        if (!this.upgraded) {
            this.calls.push({fnName: 'isPointInPath', args, setter: false});
        }
        return isPointInPath;
    }

    isPointInStroke(pathOrX: Path2D | number, xOrY: number, y?: number): boolean {
        const args = [...arguments] as [number, number] | [Path2D, number, number];
        const isPointInStroke = this.implementation.isPointInStroke.apply(this.implementation, args);
        if (!this.upgraded) {
            this.calls.push({fnName: 'isPointInStroke', args, setter: false});
        }
        return isPointInStroke;
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
        this.implementation.rotate(angle);
        if (!this.upgraded) {
            this.calls.push({fnName: 'rotate', args: [angle], setter: false});
        }
    }

    scale(x: number, y: number): void {
        this.implementation.scale(x, y);
        if (!this.upgraded) {
            this.calls.push({fnName: 'scale', args: [x, y], setter: false});
        }
    }

    translate(x: number, y: number): void {
        this.implementation.translate(x, y);
        if (!this.upgraded) {
            this.calls.push({fnName: 'translate', args: [x, y], setter: false});
        }
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.implementation.transform(a, b, c, d, e, f);
        if (!this.upgraded) {
            this.calls.push({fnName: 'transform', args: [a, b, c, d, e, f], setter: false});
        }
    }

    setTransform(transformOrA?: DOMMatrix2DInit | number, 
        bOrC?: number, 
        cOrD?: number, 
        dOrE?: number, 
        eOrF?: number,
        f?: number): void {
            const args = [...arguments] as [] | [DOMMatrix2DInit] |
                [number, number, number, number, number, number];

            this.implementation.setTransform.apply(this.implementation, args);
            if (!this.upgraded) {
                this.calls.push({fnName: 'setTransform', args, setter: false});
            }
    }

    /* experimental */resetTransform(): void {
        this.implementation.resetTransform();
        if (!this.upgraded) {
            this.calls.push({fnName: 'resetTransform', args: [], setter: false});
        }
    }

    /* COMPOSITING */
    set globalAlpha(value: number) {
        this.implementation.globalAlpha = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'globalAlpha', args: [value], setter: true});
        }
    }

    set globalCompositeOperation(value: string) {
        this.implementation.globalCompositeOperation = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'globalCompositeOperation', args: [value], setter: true});
        }
    }

    /* DRAWING IMAGES */
    drawImage(image: CanvasImageSource, dx: number, dy: number): void {
        this.implementation.drawImage(image, dx, dy);
        if (!this.upgraded) {
            this.calls.push({fnName: 'drawImage', args: [image, dx, dy], setter: false});
        }
    }

    /* PIXEL MANIPULATION */
    createImageData(imagedataOrWidth: ImageData | number, widthOrHeight?: number): ImageData {
        const args = [...arguments] as [ImageData] | [number, number];
        const imagedata = this.implementation.createImageData.apply(this.implementation, args);
        if (!this.upgraded) {
            this.calls.push({fnName: 'createImageData', args, setter: false});
        }
        return imagedata;
    }

    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
        const imageData = this.implementation.getImageData(sx, sy, sw, sh);
        if (!this.upgraded) {
            this.calls.push({fnName: 'getImageData', args: [sx, sy, sw, sh], setter: false});
        }
        return imageData;
    }

    putImageData(imageData: ImageData, dx: number, dy: number): void {
        this.implementation.putImageData(imageData, dx, dy);
        if (!this.upgraded) {
            this.calls.push({fnName: 'putImageData', args: [imageData, dx, dy], setter: false});
        }
    }

    /* IMAGE SMOOTHING */
    /* experimental */set imageSmoothingEnabled(value: boolean) {
        this.implementation.imageSmoothingEnabled = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'imageSmoothingEnabled', args: [value], setter: true});
        }
    }

    /* experimental */set imageSmoothingQuality(value: ImageSmoothingQuality) {
        this.implementation.imageSmoothingQuality = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'imageSmoothingQuality', args: [value], setter: true});
        }
    }

    /* THE CANVAS STATE */
    save(): void {
        this.implementation.save();
        if (!this.upgraded) {
            this.calls.push({fnName: 'save', args: [], setter: false});
        }
    }

    restore(): void {
        this.implementation.restore();
        if (!this.upgraded) {
            this.calls.push({fnName: 'restore', args: [], setter: false});
        }
    }

    // canvas property is readonly. We don't want to implement getters, but this must be here
    // in order for TypeScript to not complain (for now)
    get canvas(): HTMLCanvasElement {
        return this.canvasElement;
    }

    /* FILTERS */
    /* experimental */set filter(value: string) {
        this.implementation.filter = value;
        if (!this.upgraded) {
            this.calls.push({fnName: 'filter', args: [value], setter: true});
        }
    }
}

//////////////////////////////
/* Unimplemented Properties */
//////////////////////////////
/* Line styles */
// CanvasRenderingContext2D.lineWidth
// CanvasRenderingContext2D.lineCap
// CanvasRenderingContext2D.lineJoin
// CanvasRenderingContext2D.miterLimit
// CanvasRenderingContext2D.lineDashOffset

/* Text styles */
// CanvasRenderingContext2D.font
// CanvasRenderingContext2D.textAlign
// CanvasRenderingContext2D.textBaseline
// CanvasRenderingContext2D.direction

/* Fill and stroke styles */
// CanvasRenderingContext2D.fillStyle
// CanvasRenderingContext2D.strokeStyle

/* Shadows */
// CanvasRenderingContext2D.shadowBlur
// CanvasRenderingContext2D.shadowColor
// CanvasRenderingContext2D.shadowOffsetX
// CanvasRenderingContext2D.shadowOffsetY

/* Transformations */
// CanvasRenderingContext2D.currentTransform

/* Compositing */
// CanvasRenderingContext2D.globalAlpha
// CanvasRenderingContext2D.globalCompositeOperation

/* Image smoothing */
// CanvasRenderingContext2D.imageSmoothingEnabled
// CanvasRenderingContext2D.imageSmoothingQuality

/* The canvas state */
// CanvasRenderingContext2D.canvas (READONLY)

/* Filters */
// CanvasRenderingContext2D.filter

///////////////////////////
/* Unimplemented Methods */
///////////////////////////
/* Drawing rectangles */
// CanvasRenderingContext2D.clearRect()
// CanvasRenderingContext2D.fillRect()
// CanvasRenderingContext2D.strokeRect()

/* Drawing text */
// CanvasRenderingContext2D.fillText()
// CanvasRenderingContext2D.strokeText()
// CanvasRenderingContext2D.measureText()

/* Line styles */
// CanvasRenderingContext2D.getLineDash()
// CanvasRenderingContext2D.setLineDash()

/* Gradients and patterns */
// CanvasRenderingContext2D.createLinearGradient()
// CanvasRenderingContext2D.createRadialGradient()
// CanvasRenderingContext2D.createPattern()

/* Paths */
// CanvasRenderingContext2D.beginPath()
// CanvasRenderingContext2D.closePath()
// CanvasRenderingContext2D.moveTo()
// CanvasRenderingContext2D.lineTo()
// CanvasRenderingContext2D.bezierCurveTo()
// CanvasRenderingContext2D.quadraticCurveTo()
// CanvasRenderingContext2D.arc()
// CanvasRenderingContext2D.arcTo()
// CanvasRenderingContext2D.ellipse()
// CanvasRenderingContext2D.rect()

/* Drawing paths */
// CanvasRenderingContext2D.fill()
// CanvasRenderingContext2D.stroke()
// CanvasRenderingContext2D.drawFocusIfNeeded()
// CanvasRenderingContext2D.scrollPathIntoView()
// CanvasRenderingContext2D.clip()
// CanvasRenderingContext2D.isPointInPath()
// CanvasRenderingContext2D.isPointInStroke()

/* Transformations */
// CanvasRenderingContext2D.rotate()
// CanvasRenderingContext2D.scale()
// CanvasRenderingContext2D.translate()
// CanvasRenderingContext2D.transform()
// CanvasRenderingContext2D.setTransform()
// CanvasRenderingContext2D.resetTransform()

/* Drawing images */
// CanvasRenderingContext2D.drawImage()

/* Pixel manipulation */
// CanvasRenderingContext2D.createImageData()
// CanvasRenderingContext2D.getImageData()
// CanvasRenderingContext2D.putImageData()

/* The canvas state */
// CanvasRenderingContext2D.save()
// CanvasRenderingContext2D.restore()

/* Hit regions */
// CanvasRenderingContext2D.addHitRegion()
// CanvasRenderingContext2D.removeHitRegion()
// CanvasRenderingContext2D.clearHitRegions()