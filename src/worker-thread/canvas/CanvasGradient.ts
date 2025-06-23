import { Document } from '../dom/Document.js';
import { transfer } from '../MutationTransfer.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { serializeTransferrableObject } from '../serializeTransferrableObject.js';
import { store } from '../strings.js';
import { TransferrableObject } from '../worker-thread.js';
import { TransferrableObjectType } from '../../transfer/TransferrableMutation.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';

/**
 * Wrapper class for CanvasGradient. The user will be able to manipulate as a regular CanvasGradient object.
 */
export class CanvasGradient implements TransferrableObject {
  private id: number;
  private document: Document;

  constructor(id: number, document: Document) {
    this.document = document;
    this.id = id;
  }

  addColorStop(offset: number, color: string) {
    transfer(this.document, [
      TransferrableMutationType.OBJECT_MUTATION,
      store('addColorStop'),
      2, // arg count
      ...this[TransferrableKeys.serializeAsTransferrableObject](),
      ...serializeTransferrableObject([...arguments]),
    ]);
  }

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }
}
