import { Element, registerSubclass } from './Element';
import { NodeName, Node, NamespaceURI } from './Node';
import { SVG_NAMESPACE, NodeType } from '../../transfer/TransferrableNodes';

export class SVGElement extends Element {
  constructor(nodeType: NodeType, localName: NodeName, namespaceURI: NamespaceURI, ownerDocument: Node) {
    super(nodeType, localName, SVG_NAMESPACE, ownerDocument);
    // Element uppercases its nodeName, but SVG elements don't.
    this.nodeName = localName;
  }
}
registerSubclass('svg', SVGElement, SVG_NAMESPACE);
