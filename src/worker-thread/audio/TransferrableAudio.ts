import { TransferrableObject } from '../worker-thread';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { transfer } from '../MutationTransfer';
import { Document } from '../dom/Document';
import { createObjectReference } from '../object-reference';

export abstract class TransferrableAudio implements TransferrableObject {
  public readonly id: number;
  public readonly document: Document;

  constructor(id: number, document: Document) {
    this.id = id;
    this.document = document;
  }

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }

  createObjectReference(creationMethod: string, creationArgs: any[]): number {
    return createObjectReference(this.document, this, creationMethod, creationArgs);
  }

  protected [TransferrableKeys.mutated](fnName: string, args: any[]) {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, fnName, this, args]);
  }

  protected setProperty(name: string, value: any) {
    transfer(this.document, [TransferrableMutationType.PROPERTIES, this, name, value]);
  }
}
