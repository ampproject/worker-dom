import { TransferrableObjectType } from '../../transfer/TransferrableMutation.js';
import { TransferrableObject } from '../worker-thread.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';

/**
 * Wrapper class for CanvasPattern. The user will be able to manipulate as a regular CanvasPattern object.
 * This class will be used when the CanvasRenderingContext is using an OffscreenCanvas polyfill.
 */
export class CanvasPattern implements TransferrableObject {
  private id: number;

  constructor(id: number) {
    this.id = id;
  }

  /**
   * This is an experimental method.
   */
  setTransform() {}

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }
}
