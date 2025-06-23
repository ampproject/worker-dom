import { Element, NS_NAME_TO_CLASS } from './Element.js';
import { HTMLElement } from './HTMLElement.js';
import './HTMLAnchorElement.js';
import './HTMLButtonElement.js';
import './HTMLCanvasElement.js';
import './HTMLDataElement.js';
import './HTMLDataListElement.js';
import './HTMLEmbedElement.js';
import './HTMLFieldSetElement.js';
import './HTMLFormElement.js';
import './HTMLIFrameElement.js';
import './HTMLImageElement.js';
import './HTMLInputElement.js';
import './HTMLLabelElement.js';
import './HTMLLinkElement.js';
import './HTMLMapElement.js';
import './HTMLMeterElement.js';
import './HTMLModElement.js';
import './HTMLOListElement.js';
import './HTMLOptionElement.js';
import './HTMLProgressElement.js';
import './HTMLQuoteElement.js';
import './HTMLScriptElement.js';
import './HTMLSelectElement.js';
import './HTMLSourceElement.js';
import './HTMLStyleElement.js';
import './HTMLTableCellElement.js';
import './HTMLTableColElement.js';
import './HTMLTableElement.js';
import './HTMLTableRowElement.js';
import './HTMLTableSectionElement.js';
import './HTMLTimeElement.js';
import { matchChildElement } from './matchElements.js';
import { NamespaceURI, Node } from './Node.js';
import { Text } from './Text.js';
import { Comment } from './Comment.js';
import { toLower } from '../../utils.js';
import { DocumentFragment } from './DocumentFragment.js';
import { PostMessage } from '../worker-thread.js';
import { NodeType, HTML_NAMESPACE, HydrateableNode } from '../../transfer/TransferrableNodes.js';
import { Phase } from '../../transfer/Phase.js';
import { propagate as propagateEvents } from '../Event.js';
import { propagate as propagateSyncValues } from '../SyncValuePropagation.js';
import { propagate as propagateResize } from '../ResizePropagation.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { WorkerDOMGlobalScope, GlobalScope } from '../WorkerDOMGlobalScope.js';
import { set as setPhase } from '../phase.js';

const DOCUMENT_NAME = '#document';

export class Document extends Element {
  public defaultView: WorkerDOMGlobalScope;
  public documentElement: Document;
  public body: Element;

  // Internal variables.
  public postMessage: PostMessage;
  public addGlobalEventListener: Function;
  public removeGlobalEventListener: Function;
  public [TransferrableKeys.allowTransfer]: boolean = true;

  constructor(global: GlobalScope) {
    super(NodeType.DOCUMENT_NODE, DOCUMENT_NAME, HTML_NAMESPACE, null);
    // Element uppercases its nodeName, but Document doesn't.
    this.nodeName = DOCUMENT_NAME;
    this.documentElement = this; // TODO(choumx): Should be the <html> element.

    this.defaultView = Object.assign(global, {
      document: this,
      addEventListener: this.addEventListener.bind(this),
      removeEventListener: this.removeEventListener.bind(this),
    });
  }

  /**
   * Observing the Document indicates it's attached to a main thread
   * version of the document.
   *
   * Each mutation needs to be transferred, synced values need to propagate.
   */
  public [TransferrableKeys.observe](): void {
    setPhase(Phase.Hydrating);
    propagateEvents(this.defaultView);
    propagateSyncValues(this.defaultView);
    propagateResize(this.defaultView);
  }

  /**
   * Hydrate
   * @param strings
   * @param skeleton
   */
  public [TransferrableKeys.hydrateNode](strings: Array<string>, skeleton: HydrateableNode): Node {
    switch (skeleton[TransferrableKeys.nodeType]) {
      case NodeType.TEXT_NODE:
        return new Text(strings[skeleton[TransferrableKeys.textContent] as number], this, skeleton[TransferrableKeys.index]);
      case NodeType.COMMENT_NODE:
        return new Comment(strings[skeleton[TransferrableKeys.textContent] as number], this, skeleton[TransferrableKeys.index]);
      default:
        const namespaceURI: string = strings[skeleton[TransferrableKeys.namespaceURI] as number] || HTML_NAMESPACE;
        const localName: string = strings[skeleton[TransferrableKeys.localOrNodeName]];
        const constructor = NS_NAME_TO_CLASS[`${namespaceURI}:${localName}`] || HTMLElement;
        const node = new constructor(NodeType.ELEMENT_NODE, localName, namespaceURI, this, skeleton[TransferrableKeys.index]);

        (skeleton[TransferrableKeys.attributes] || []).forEach((attribute) =>
          // AttributeNamespaceURI = strings[attribute[0]] !== 'null' ? strings[attribute[0]] : HTML_NAMESPACE
          node.setAttributeNS(
            strings[attribute[0]] !== 'null' ? strings[attribute[0]] : HTML_NAMESPACE,
            strings[attribute[1]],
            strings[attribute[2]],
          ),
        );
        (skeleton[TransferrableKeys.childNodes] || []).forEach((child) => node.appendChild(this[TransferrableKeys.hydrateNode](strings, child)));
        return node;
    }
  }

  public createElement(name: string): Element {
    return this.createElementNS(HTML_NAMESPACE, toLower(name));
  }

  public createElementNS(namespaceURI: NamespaceURI, localName: string): Element {
    const constructor = NS_NAME_TO_CLASS[`${namespaceURI}:${localName}`] || HTMLElement;
    return new constructor(NodeType.ELEMENT_NODE, localName, namespaceURI, this);
  }

  /**
   * Note: Unlike DOM, Event subclasses (e.g. MouseEvent) are not instantiated based on `type`.
   * @param type
   */
  public createEvent(type: string): Event {
    return new Event(type, { bubbles: false, cancelable: false });
  }

  public createTextNode(text: string): Text {
    return new Text(text, this);
  }

  public createComment(text: string): Comment {
    return new Comment(text, this);
  }

  public createDocumentFragment(): DocumentFragment {
    return new DocumentFragment(this);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
   * @return Element with matching id attribute.
   */
  public getElementById(id: string): Element | null {
    return matchChildElement(this.body, (element) => element.id === id);
  }
}
