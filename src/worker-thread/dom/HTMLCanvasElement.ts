import { HTMLElement } from './HTMLElement';
import { registerSubclass } from './Element';
import { reflectProperties, registerListenableProperties } from './enhanceElement';
import { CanvasRenderingContext2DShim } from '../canvas/CanvasRenderingContext2D';
import { WebGLRenderingContextPolyfill } from '../canvas/WebGLRenderingContextPolyfill';
import { Document } from './Document';
import { createObjectReference } from '../object-reference';

export class HTMLCanvasElement extends HTMLElement {
  public static webGLInfo: {
    [contextType: string]: {
      extensions: string[] | null;
      attributes: WebGLContextAttributes | null;
      parameters: { [key: number]: any } | null;
    } | null;
  } = {};

  private context2d: CanvasRenderingContext2DShim<HTMLCanvasElement>;
  private contextWebGLs: { [contextType: string]: WebGLRenderingContextPolyfill } = {};

  getContext(contextType: string, contextAttributes?: {}): CanvasRenderingContext2DShim<HTMLCanvasElement> | WebGLRenderingContextPolyfill | null {
    contextType = contextType.toLowerCase();
    switch (contextType) {
      case '2d':
        if (!this.context2d) {
          this.context2d = new CanvasRenderingContext2DShim<HTMLCanvasElement>(this);
        }
        return this.context2d;
      case 'webgl':
      case 'experimental-webgl':
      case 'webgl2': {
        const contextInfo = HTMLCanvasElement.webGLInfo[contextType];
        if (!contextInfo) {
          return null;
        }

        if (!(contextType in this.contextWebGLs)) {
          contextAttributes = {
            ...contextInfo.attributes,
            ...(contextAttributes || {}),
          };

          this.contextWebGLs[contextType] = createObjectReference(
            this.ownerDocument as Document,
            this,
            'getContext',
            [...arguments],
            (id) => new WebGLRenderingContextPolyfill(id, this, contextAttributes, contextInfo),
          );
        }
        return this.contextWebGLs[contextType];
      }
      default:
        throw new Error(`Context type "${contextType}" not supported.`);
    }
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

registerListenableProperties(
  {
    offsetLeft: 0,
    offsetTop: 0,
  },
  HTMLCanvasElement,
);
