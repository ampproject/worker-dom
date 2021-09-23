import { Document } from '../dom/Document';
import { transfer } from '../MutationTransfer';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { serializeTransferrableObject } from '../serializeTransferrableObject';
import { store } from '../strings';
import { TransferrableObject } from '../worker-thread';
import { TransferrableObjectType } from '../../transfer/TransferrableMutation';
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
