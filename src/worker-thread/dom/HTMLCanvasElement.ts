import { HTMLElement } from './HTMLElement';
import { registerSubclass } from './Element';
import { reflectProperties } from './enhanceElement';
import { CanvasRenderingContext2DShim } from '../canvas/CanvasRenderingContext2D';

export class HTMLCanvasElement extends HTMLElement {
  private context: CanvasRenderingContext2DShim<HTMLCanvasElement>;

  getContext(contextType: string): CanvasRenderingContext2DShim<HTMLCanvasElement> {
    if (!this.context) {
      if (contextType === '2D' || contextType === '2d') {
        this.context = new CanvasRenderingContext2DShim<HTMLCanvasElement>(this);
      } else {
        throw new Error('Context type not supported.');
      }
    }
    return this.context;
  }
}
registerSubclass('canvas', HTMLCanvasElement);

// Reflected Properties
// HTMLCanvasElement.height => number, reflected attribute
// HTMLCanvasElement.width => number, reflected attribute
reflectProperties([{ height: [0] }, { width: [0] }], HTMLCanvasElement);

// Unimplemented Properties
// HTMLCanvasElement.mozOpaque => boolean
// HTMLCanvasElement.mozPrintCallback => function

// Unimplemented Methods
// HTMLCanvasElement.captureStream()
// HTMLCanvasElement.toDataURL()
// HTMLCanvasElement.toBlob()
// HTMLCanvasElement.transferControlToOffscreen()
// HTMLCanvasElement.mozGetAsFile()
