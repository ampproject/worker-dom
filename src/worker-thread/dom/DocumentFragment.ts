import { ParentNode } from './ParentNode';
import { store as storeString } from '../strings';
import { Node } from './Node';
import { NodeType } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

export class DocumentFragment extends ParentNode {
  constructor(ownerDocument: Node, overrideIndex?: number) {
    super(NodeType.DOCUMENT_FRAGMENT_NODE, '#document-fragment', ownerDocument, overrideIndex);

    this[TransferrableKeys.creationFormat] = [this[TransferrableKeys.index], NodeType.DOCUMENT_FRAGMENT_NODE, storeString(this.nodeName), 0, 0];
  }

  /**
   * @param deep boolean determines if the clone should include a recursive copy of all childNodes.
   * @return DocumentFragment containing childNode clones of the DocumentFragment requested to be cloned.
   */
  public cloneNode(deep: boolean = false): DocumentFragment {
    const clone: DocumentFragment = this.ownerDocument.createDocumentFragment();
    if (deep) {
      this.childNodes.forEach((child) => clone.appendChild(child.cloneNode(deep)));
    }
    return clone;
  }
}
