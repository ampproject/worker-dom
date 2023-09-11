import { TransferrableObject } from '../worker-thread';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { transfer } from '../MutationTransfer';
import { Document } from './Document';
import { DocumentStub } from './DocumentStub';
import { createObjectReference } from '../object-reference';

export class History implements TransferrableObject {
  public readonly length: number = 1;
  public readonly state: any = { idx: 0 };
  private id: number;
  private readonly document: Document | DocumentStub;

  private _scrollRestoration = 'auto';

  constructor(document: Document | DocumentStub) {
    this.document = document;
  }

  get scrollRestoration(): string {
    return this._scrollRestoration;
  }

  set scrollRestoration(value: string) {
    if (this._scrollRestoration != value) {
      this.checkInitialized();

      transfer(this.document, [TransferrableMutationType.PROPERTIES, this, 'scrollRestoration', value]);
      this._scrollRestoration = value;
    }
  }

  back(): void {
    this[TransferrableKeys.mutated]('back', []);
  }

  forward(): void {
    this[TransferrableKeys.mutated]('forward', []);
  }

  go(delta?: number): void {
    this[TransferrableKeys.mutated]('go', arguments);
  }

  pushState(data: any, unused: string, url?: string | URL | null): void {
    this[TransferrableKeys.mutated]('pushState', arguments);
  }

  replaceState(data: any, unused: string, url?: string | URL | null): void {
    this[TransferrableKeys.mutated]('replaceState', arguments);
  }

  public [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }

  private [TransferrableKeys.mutated](fnName: string, args: any[] | IArguments) {
    this.checkInitialized();
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, fnName, this, args]);
  }

  private checkInitialized() {
    if (this.id) {
      return;
    }
    createObjectReference(this.document, self, 'history', [], (id) => {
      this.id = id;
      return this;
    });
  }
}
