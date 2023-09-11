import { TransferrableObject } from '../worker-thread';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { transfer } from '../MutationTransfer';
import { Document } from '../dom/Document';
import { createObjectReference, setObjectReference } from '../object-reference';
import { appendGlobalEventProperties, EventTarget } from '../event-subscription/EventTarget';

export abstract class TransferrableAudio extends EventTarget implements TransferrableObject {
  public readonly id: number;
  public readonly document: Document;
  public [TransferrableKeys.propertyEventHandlers]: {
    [key: string]: Function;
  } = {};

  constructor(id: number, document: Document, keys?: Array<string>) {
    super(document);
    this.id = id;
    this.document = document;
    if (keys) {
      appendGlobalEventProperties(TransferrableAudio, keys);
    }
    setObjectReference(id, this);
  }

  parent(): any {
    return null;
  }

  [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }

  createObjectReference<T>(creationMethod: string, creationArgs: any[] | IArguments, instanceCreationFn: (id: number) => T): T {
    return createObjectReference(this.document, this, creationMethod, creationArgs, instanceCreationFn);
  }

  protected [TransferrableKeys.mutated](fnName: string, args: any[] | IArguments) {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, fnName, this, args]);
  }

  protected setProperty(name: string, value: any) {
    transfer(this.document, [TransferrableMutationType.PROPERTIES, this, name, value]);
  }
}
