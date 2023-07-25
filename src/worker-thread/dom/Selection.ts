import { Node } from './Node';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { TransferrableObject } from '../worker-thread';
import { transfer } from '../MutationTransfer';
import { Document } from './Document';
import { DocumentStub } from './DocumentStub';
import { DocumentFragment } from './DocumentFragment';
import { createObjectReference } from '../object-reference';

export class Selection implements TransferrableObject {
  private readonly id: number;
  private readonly document: Document | DocumentStub;

  readonly anchorNode: Node | null = null;
  readonly anchorOffset: number = 0;
  readonly focusNode: Node | null = null;
  readonly focusOffset: number = 0;
  readonly isCollapsed: boolean = false;
  readonly rangeCount: number = 0;
  readonly type: string = '';

  constructor(id: number, document: Document | DocumentStub) {
    this.id = id;
    this.document = document;
  }

  public [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }

  addRange(range: Range): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'addRange', this, [...arguments]]);
  }

  collapse(node: Node | null, offset?: number): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'collapse', this, [...arguments]]);
  }

  collapseToEnd(): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'collapseToEnd', this, []]);
  }

  collapseToStart(): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'collapseToStart', this, []]);
  }

  containsNode(node: Node, allowPartialContainment?: boolean): boolean {
    throw new Error('NOT IMPLEMENTED');
  }

  deleteFromDocument(): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'deleteFromDocument', this, []]);
  }

  empty(): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'empty', this, []]);
  }

  extend(node: Node, offset?: number): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'extend', this, [...arguments]]);
  }

  getRangeAt(index: number): Range {
    return createObjectReference(this.document, this, 'getRangeAt', [...arguments], (id) => new Range(id, this.document));
  }

  removeAllRanges(): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'removeAllRanges', this, []]);
  }

  removeRange(range: Range): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'removeRange', this, [...arguments]]);
  }

  selectAllChildren(node: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'selectAllChildren', this, [...arguments]]);
  }

  setBaseAndExtent(anchorNode: Node, anchorOffset: number, focusNode: Node, focusOffset: number): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'setBaseAndExtent', this, [...arguments]]);
  }

  setPosition(node: Node | null, offset?: number): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'setPosition', this, [...arguments]]);
  }
}

export class Range implements TransferrableObject {
  private readonly id: number;
  private readonly document: Document | DocumentStub;

  readonly END_TO_END: number = 0;
  readonly END_TO_START: number = 0;
  readonly START_TO_END: number = 0;
  readonly START_TO_START: number = 0;
  readonly collapsed: boolean = false;
  readonly commonAncestorContainer: Node | null = null;
  readonly endContainer: Node | null = null;
  readonly endOffset: number = 0;
  readonly startContainer: Node | null = null;
  readonly startOffset: number = 0;

  constructor(id: number, document: Document | DocumentStub) {
    this.id = id;
    this.document = document;
  }

  public [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return [TransferrableObjectType.TransferObject, this.id];
  }

  cloneContents(): DocumentFragment {
    throw new Error('NOT IMPLEMENTED');
  }

  cloneRange(): Range {
    return createObjectReference(this.document, this, 'cloneRange', [], (id) => new Range(id, this.document));
  }

  collapse(toStart?: boolean): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'collapse', this, [...arguments]]);
  }

  compareBoundaryPoints(how: number, sourceRange: Range): number {
    throw new Error('NOT IMPLEMENTED');
  }

  comparePoint(node: Node, offset: number): number {
    throw new Error('NOT IMPLEMENTED');
  }

  createContextualFragment(fragment: string): DocumentFragment {
    throw new Error('NOT IMPLEMENTED');
  }

  deleteContents(): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'deleteContents', this, []]);
  }

  detach(): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'detach', this, []]);
  }

  extractContents(): DocumentFragment {
    throw new Error('NOT IMPLEMENTED');
  }

  getBoundingClientRect(): DOMRect {
    throw new Error('NOT IMPLEMENTED');
  }

  getClientRects(): any {
    throw new Error('NOT IMPLEMENTED');
  }

  insertNode(node: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'insertNode', this, [...arguments]]);
  }

  intersectsNode(node: Node): boolean {
    throw new Error('NOT IMPLEMENTED');
  }

  isPointInRange(node: Node, offset: number): boolean {
    throw new Error('NOT IMPLEMENTED');
  }

  selectNode(node: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'selectNode', this, [...arguments]]);
  }

  selectNodeContents(node: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'selectNodeContents', this, [...arguments]]);
  }

  setEnd(node: Node, offset: number): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'setEnd', this, [...arguments]]);
  }

  setEndAfter(node: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'setEndAfter', this, [...arguments]]);
  }

  setEndBefore(node: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'setEndBefore', this, [...arguments]]);
  }

  setStart(node: Node, offset: number): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'setStart', this, [...arguments]]);
  }

  setStartAfter(node: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'setStartAfter', this, [...arguments]]);
  }

  setStartBefore(node: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'setStartBefore', this, [...arguments]]);
  }

  surroundContents(newParent: Node): void {
    transfer(this.document, [TransferrableMutationType.OBJECT_MUTATION, 'surroundContents', this, [...arguments]]);
  }
}
