import { Node, NodeName } from './Node';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { store as storeString } from '../strings';
import { Document } from './Document';
import { NodeType } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { getNextElementSibling, getPreviousElementSibling } from './elementSibling';

// @see https://developer.mozilla.org/en-US/docs/Web/API/CharacterData
export abstract class CharacterData extends Node {
  private [TransferrableKeys.data]: string;

  constructor(data: string, nodeType: NodeType, nodeName: NodeName, ownerDocument: Node, overrideIndex?: number) {
    super(nodeType, nodeName, ownerDocument, overrideIndex);
    this[TransferrableKeys.data] = data;

    this[TransferrableKeys.creationFormat] = [this[TransferrableKeys.index], nodeType, storeString(nodeName), storeString(data), 0];
  }

  // Unimplemented Methods
  // NonDocumentTypeChildNode.nextElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling
  // NonDocumentTypeChildNode.previousElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling
  // CharacterData.appendData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/appendData
  // CharacterData.deleteData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/deleteData
  // CharacterData.insertData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/insertData
  // CharacterData.replaceData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/replaceData
  // CharacterData.substringData() – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/substringData

  /**
   * @return Returns the string contained in private CharacterData.data
   */
  get data(): string {
    return this[TransferrableKeys.data];
  }

  /**
   * @param value string value to store as CharacterData.data.
   */
  set data(value: string) {
    const oldValue = this.data;
    this[TransferrableKeys.data] = value;

    mutate(
      this.ownerDocument as Document,
      {
        target: this,
        type: MutationRecordType.CHARACTER_DATA,
        value,
        oldValue,
      },
      [TransferrableMutationType.CHARACTER_DATA, this[TransferrableKeys.index], storeString(value)],
    );
  }

  /**
   * @return Returns the size of the string contained in CharacterData.data
   */
  get length(): number {
    return this[TransferrableKeys.data].length;
  }

  /**
   * @return Returns the string contained in CharacterData.data
   */
  get nodeValue(): string {
    return this[TransferrableKeys.data];
  }

  /**
   * @param value string value to store as CharacterData.data.
   */
  set nodeValue(value: string) {
    this.data = value;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling
   * Returns the Element immediately prior to the specified one in its parent's children list,
   * or null if the specified element is the first one in the list.
   */
  get previousElementSibling(): Node | null {
    return getPreviousElementSibling(this);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling
   * Returns the Element immediately following the specified one in its parent's children list,
   * or null if the specified element is the last one in the list.
   */
  get nextElementSibling(): Node | null {
    return getNextElementSibling(this);
  }
}
