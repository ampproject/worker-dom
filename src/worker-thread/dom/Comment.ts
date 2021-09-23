import { CharacterData } from './CharacterData';
import { Node } from './Node';
import { NodeType } from '../../transfer/TransferrableNodes';

// @see https://developer.mozilla.org/en-US/docs/Web/API/Comment
export class Comment extends CharacterData {
  constructor(data: string, ownerDocument: Node, overrideIndex?: number) {
    super(data, NodeType.COMMENT_NODE, '#comment', ownerDocument, overrideIndex);
  }

  /**
   * textContent getter, retrieves underlying CharacterData data.
   * This is a different implmentation than DOMv1-4 APIs, but should be transparent to Frameworks.
   */
  get textContent(): string {
    return this.data;
  }

  /**
   * textContent setter, mutates underlying CharacterData data.
   * This is a different implmentation than DOMv1-4 APIs, but should be transparent to Frameworks.
   * @param value new value
   */
  set textContent(value: string) {
    // Mutation Observation is performed by CharacterData.
    this.nodeValue = value;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
   * @return new Comment Node with the same data as the Comment to clone.
   */
  public cloneNode(): Comment {
    return this.ownerDocument.createComment(this.data);
  }
}
