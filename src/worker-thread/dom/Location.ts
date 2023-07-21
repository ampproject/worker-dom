import { TransferrableObject } from '../worker-thread';
import { Document } from './Document';
import { DocumentStub } from './DocumentStub';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { transfer } from '../MutationTransfer';

export class Location implements TransferrableObject {
  private readonly id: number;
  private readonly document: Document | DocumentStub;

  readonly ancestorOrigins: DOMStringList;
  readonly origin: string;
  private _hash: string;
  private _host: string;
  private _hostname: string;
  private _href: string;
  private _pathname: string;
  private _port: string;
  private _protocol: string;
  private _search: string;

  constructor(id: number, document: Document | DocumentStub, location: { [type: string]: any }) {
    this.id = id;
    this.document = document;
    this.ancestorOrigins = location.ancestorOrigins;
    this.origin = location.origin;
    this._hash = location.hash;
    this._host = location.host;
    this._hostname = location.hostname;
    this._href = location.href;
    this._pathname = location.pathname;
    this._port = location.port;
    this._protocol = location.protocol;
    this._search = location.search;
  }

  assign(url: string | URL): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'assign', this, [...arguments]]);
  }

  reload(): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'reload', this, []]);
  }

  replace(url: string | URL): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'replace', this, []]);
  }

  get hash(): string {
    return this._hash;
  }

  set hash(value: string) {
    if (this._hash != value) {
      this.setProperty('hash', value);
      this._hash = value;
    }
  }

  get host(): string {
    return this._host;
  }

  set host(value: string) {
    if (this._host != value) {
      this.setProperty('host', value);
      this._host = value;
    }
  }

  get hostname(): string {
    return this._hostname;
  }

  set hostname(value: string) {
    if (this._hostname != value) {
      this.setProperty('hostname', value);
      this._hostname = value;
    }
  }

  get href(): string {
    return this._href;
  }

  set href(value: string) {
    if (this._href != value) {
      this.setProperty('href', value);
      this._href = value;
    }
  }

  get pathname(): string {
    return this._pathname;
  }

  set pathname(value: string) {
    if (this._pathname != value) {
      this.setProperty('pathname', value);
      this._pathname = value;
    }
  }

  get port(): string {
    return this._port;
  }

  set port(value: string) {
    if (this._port != value) {
      this.setProperty('port', value);
      this._port = value;
    }
  }

  get protocol(): string {
    return this._protocol;
  }

  set protocol(value: string) {
    if (this._protocol != value) {
      this.setProperty('protocol', value);
      this._protocol = value;
    }
  }

  get search(): string {
    return this._search;
  }

  set search(value: string) {
    if (this._search != value) {
      this.setProperty('search', value);
      this._search = value;
    }
  }

  public [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }

  private setProperty(name: string, value: any) {
    transfer(this.document, [TransferrableMutationType.PROPERTIES, this, name, value]);
  }
}
