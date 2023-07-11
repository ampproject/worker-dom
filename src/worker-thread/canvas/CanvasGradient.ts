import { Document } from '../dom/Document';
import { transfer } from '../MutationTransfer';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { TransferrableObject } from '../worker-thread';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

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
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'addColorStop', this, [offset, color]]);
  }

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }
}
