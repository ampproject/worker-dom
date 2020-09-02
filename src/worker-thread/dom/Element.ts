/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Node, NodeName, NamespaceURI } from './Node';
import { ParentNode } from './ParentNode';
import { DOMTokenList, synchronizedAccessor } from './DOMTokenList';
import { Attr, toString as attrsToString, matchPredicate as matchAttrPredicate } from './Attr';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { toLower, toUpper } from '../../utils';
import { CSSStyleDeclaration } from '../css/CSSStyleDeclaration';
import { matchChildrenElements } from './matchElements';
import { reflectProperties } from './enhanceElement';
import { store as storeString } from '../strings';
import { Document } from './Document';
import { transfer } from '../MutationTransfer';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { TransferrableBoundingClientRect } from '../../transfer/TransferrableBoundClientRect';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { MessageToWorker, MessageType, BoundingClientRectToWorker } from '../../transfer/Messages';
import { parse } from '../../third_party/html-parser/html-parser';
import { propagate } from './Node';
import { Event } from '../Event';

export const NS_NAME_TO_CLASS: { [key: string]: typeof Element } = {};
export const registerSubclass = (localName: string, subclass: typeof Element, namespace: string = HTML_NAMESPACE): any =>
  (NS_NAME_TO_CLASS[`${namespace}:${localName}`] = subclass);

interface PropertyBackedAttributes {
  [key: string]: [(el: Element) => string | null, (el: Element, value: string) => string | boolean];
}

export function definePropertyBackedAttributes(defineOn: typeof Element, attributes: PropertyBackedAttributes) {
  const sub = Object.create(defineOn[TransferrableKeys.propertyBackedAttributes]);
  defineOn[TransferrableKeys.propertyBackedAttributes] = Object.assign(sub, attributes);
}

interface ClientRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * There are six kinds of elements, each having different start/close tag semantics.
 * @see https://html.spec.whatwg.org/multipage/syntax.html#elements-2
 */
enum ElementKind {
  NORMAL,
  VOID,
  // The following element kinds have no special handling in worker-dom yet
  // and are lumped into the NORMAL kind.
  /*
  FOREIGN,
  TEMPLATE,
  RAW_TEXT,
  ESCAPABLE_RAW,
  */
}

/**
 * @see https://html.spec.whatwg.org/multipage/syntax.html#void-elements
 */
const VOID_ELEMENTS: string[] = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'];

export class Element extends ParentNode {
  private _classList: DOMTokenList;

  public static [TransferrableKeys.propertyBackedAttributes]: PropertyBackedAttributes = {
    class: [(el): string | null => el.classList.value, (el, value: string) => (el.classList.value = value)],
    style: [(el): string | null => el.cssText, (el, value: string) => (el.cssText = value)],
  };

  public localName: NodeName;
  public attributes: Attr[] = [];
  public style: CSSStyleDeclaration = new CSSStyleDeclaration(this);
  public namespaceURI: NamespaceURI;

  /**
   * Element "kind" dictates certain behaviors e.g. start/end tag semantics.
   * @see https://html.spec.whatwg.org/multipage/syntax.html#elements-2
   */
  private kind: ElementKind;

  constructor(nodeType: NodeType, localName: NodeName, namespaceURI: NamespaceURI, ownerDocument: Node | null, overrideIndex?: number) {
    super(nodeType, toUpper(localName), ownerDocument, overrideIndex);
    this.namespaceURI = namespaceURI || HTML_NAMESPACE;
    this.localName = localName;
    this.kind = VOID_ELEMENTS.includes(this.tagName) ? ElementKind.VOID : ElementKind.NORMAL;

    this[TransferrableKeys.creationFormat] = [
      this[TransferrableKeys.index],
      this.nodeType,
      storeString(this.localName),
      0,
      this.namespaceURI === null ? 0 : storeString(this.namespaceURI),
    ];
  }

  // Unimplemented properties
  // Element.clientHeight – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
  // Element.clientLeft – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientLeft
  // Element.clientTop – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientTop
  // Element.clientWidth – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
  // set Element.innerHTML – https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
  // NonDocumentTypeChildNode.nextElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling
  // Element.prefix – https://developer.mozilla.org/en-US/docs/Web/API/Element/prefix
  // NonDocummentTypeChildNode.previousElementSibling – https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling
  // Element.scrollHeight – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
  // Element.scrollLeft – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
  // Element.scrollLeftMax – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeftMax
  // Element.scrollTop – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop
  // Element.scrollTopMax – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTopMax
  // Element.scrollWidth – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollWidth
  // Element.shadowRoot – !! CustomElements – https://developer.mozilla.org/en-US/docs/Web/API/Element/shadowRoot
  // Element.slot – !! CustomElements – https://developer.mozilla.org/en-US/docs/Web/API/Element/slot
  // Element.tabStop – https://developer.mozilla.org/en-US/docs/Web/API/Element/tabStop
  // Element.undoManager – https://developer.mozilla.org/en-US/docs/Web/API/Element/undoManager
  // Element.undoScope – https://developer.mozilla.org/en-US/docs/Web/API/Element/undoScope

  // Unimplemented Methods
  // Element.attachShadow() – !! CustomElements – https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
  // Element.animate() – https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
  // Element.closest() – https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  // Element.getAttributeNames() – https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames
  // Element.getBoundingClientRect() – https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  // Element.getClientRects() – https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects
  // Element.getElementsByTagNameNS() – https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagNameNS
  // Element.insertAdjacentElement() – https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
  // Element.insertAdjacentHTML() – https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
  // Element.insertAdjacentText() – https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText
  // Element.matches() – https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
  // Element.releasePointerCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/releasePointerCapture
  // Element.requestFullscreen() – https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
  // Element.requestPointerLock() – https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock
  // Element.scrollIntoView() – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  // Element.setCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/setCapture
  // Element.setPointerCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture

  // Partially implemented Mixin Methods
  // Both Element.querySelector() and Element.querySelector() are only implemented for the following simple selectors:
  // - Element selectors
  // - ID selectors
  // - Class selectors
  // - Attribute selectors
  // Element.querySelector() – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
  // Element.querySelectorAll() – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll

  // Mixins not implemented
  // Slotable.assignedSlot – https://developer.mozilla.org/en-US/docs/Web/API/Slotable/assignedSlot

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML
   * @return string representation of serialized HTML describing the Element and its descendants.
   */
  get outerHTML(): string {
    const tag = this.localName || this.tagName;

    const start = `<${[tag, attrsToString(this.attributes)].join(' ').trim()}>`;
    const contents = this.innerHTML;

    if (!contents) {
      if (this.kind === ElementKind.VOID) {
        // Void elements e.g. <input> only have a start tag (unless children are added programmatically).
        // https://html.spec.whatwg.org/multipage/syntax.html#void-elements
        return start;
      }
    }
    return start + contents + `</${tag}>`;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
   * @return string representation of serialized HTML describing the Element's descendants.
   */
  get innerHTML(): string {
    const childNodes = this.childNodes;

    if (childNodes.length) {
      return childNodes
        .map((child) => {
          switch (child.nodeType) {
            case NodeType.TEXT_NODE:
              return child.textContent;
            case NodeType.COMMENT_NODE:
              return `<!--${child.textContent}-->`;
            default:
              return child.outerHTML;
          }
        })
        .join('');
    }
    return '';
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
   * @param html The raw html string to parse.
   */
  set innerHTML(html: string) {
    const root = parse(html, this);

    // remove previous children
    this.childNodes.forEach((n) => {
      propagate(n, 'isConnected', false);
      propagate(n, TransferrableKeys.scopingRoot, n);
    });

    mutate(
      this.ownerDocument as Document,
      {
        removedNodes: this.childNodes,
        type: MutationRecordType.CHILD_LIST,
        target: this,
      },
      [
        TransferrableMutationType.CHILD_LIST,
        this[TransferrableKeys.index],
        0,
        0,
        0,
        this.childNodes.length,
        ...this.childNodes.map((node) => node[TransferrableKeys.index]),
      ],
    );

    this.childNodes = [];

    // add new children
    root.childNodes.forEach((child: Node) => this.appendChild(child));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
   * @param text new text replacing all childNodes content.
   */
  set textContent(text: string) {
    // TODO(KB): Investigate removing all children in a single .splice to childNodes.
    this.childNodes.slice().forEach((child: Node) => child.remove());
    this.appendChild(this.ownerDocument.createTextNode(text));
  }

  /**
   * Getter returning the text representation of Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
   * @return text from all childNodes.
   */
  get textContent(): string {
    return this.getTextContent();
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
   * @return string tag name (i.e 'div')
   */
  get tagName(): string {
    return this.nodeName;
  }

  /**
   * Sets the value of an attribute on this element using a null namespace.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
   * @param name attribute name
   * @param value attribute value
   */
  public setAttribute(name: string, value: unknown): void {
    this.setAttributeNS(HTML_NAMESPACE, name, value);
  }

  /**
   * Get the value of an attribute on this Element with the null namespace.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
   * @param name attribute name
   * @return value of a specified attribute on the element, or null if the attribute doesn't exist.
   */
  public getAttribute(name: string): string | null {
    return this.getAttributeNS(HTML_NAMESPACE, name);
  }

  /**
   * Remove an attribute from this element in the null namespace.
   *
   * Method returns void, so it is not chainable.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute
   * @param name attribute name
   */
  public removeAttribute(name: string): void {
    this.removeAttributeNS(HTML_NAMESPACE, name);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute
   * @param name attribute name
   * @return Boolean indicating if the element has the specified attribute.
   */
  public hasAttribute(name: string): boolean {
    return this.hasAttributeNS(HTML_NAMESPACE, name);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributes
   * @return Boolean indicating if the element has any attributes.
   */
  public hasAttributes(): boolean {
    return this.attributes.length > 0;
  }

  /**
   * Sets the value of an attribute on this Element with the provided namespace.
   *
   * If the attribute already exists, the value is updated; otherwise a new attribute is added with the specified name and value.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNS
   * @param namespaceURI
   * @param name attribute name
   * @param value attribute value
   */
  public setAttributeNS(namespaceURI: NamespaceURI, name: string, value: unknown): void {
    const valueAsString = String(value);
    const propertyBacked = (this.constructor as typeof Element)[TransferrableKeys.propertyBackedAttributes][name];
    if (propertyBacked !== undefined) {
      if (!this.attributes.find(matchAttrPredicate(namespaceURI, name))) {
        this.attributes.push({
          namespaceURI,
          name,
          value: valueAsString,
        });
      }
      propertyBacked[1](this, valueAsString);
      return;
    }

    const oldValue = this[TransferrableKeys.storeAttribute](namespaceURI, name, valueAsString);
    mutate(
      this.ownerDocument as Document,
      {
        type: MutationRecordType.ATTRIBUTES,
        target: this,
        attributeName: name,
        attributeNamespace: namespaceURI,
        value: valueAsString,
        oldValue,
      },
      [
        TransferrableMutationType.ATTRIBUTES,
        this[TransferrableKeys.index],
        storeString(name),
        storeString(namespaceURI),
        value !== null ? storeString(valueAsString) + 1 : 0,
      ],
    );
  }

  public [TransferrableKeys.storeAttribute](namespaceURI: NamespaceURI, name: string, value: string): string {
    const attr = this.attributes.find(matchAttrPredicate(namespaceURI, name));
    const oldValue = (attr && attr.value) || '';

    if (attr) {
      attr.value = value;
    } else {
      this.attributes.push({
        namespaceURI,
        name,
        value,
      });
    }
    return oldValue;
  }

  /**
   * Get the value of an attribute on this Element with the specified namespace.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS
   * @param namespaceURI attribute namespace
   * @param name attribute name
   * @return value of a specified attribute on the element, or null if the attribute doesn't exist.
   */
  public getAttributeNS(namespaceURI: NamespaceURI, name: string): string | null {
    const attr = this.attributes.find(matchAttrPredicate(namespaceURI, name));
    if (attr) {
      const propertyBacked = (this.constructor as typeof Element)[TransferrableKeys.propertyBackedAttributes][name];
      return propertyBacked !== undefined ? propertyBacked[0](this) : attr.value;
    }
    return null;
  }

  /**
   * Remove an attribute from this element in the specified namespace.
   *
   * Method returns void, so it is not chainable.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute
   * @param namespaceURI attribute namespace
   * @param name attribute name
   */
  public removeAttributeNS(namespaceURI: NamespaceURI, name: string): void {
    const index = this.attributes.findIndex(matchAttrPredicate(namespaceURI, name));

    if (index >= 0) {
      const oldValue = this.attributes[index].value;
      this.attributes.splice(index, 1);

      mutate(
        this.ownerDocument as Document,
        {
          type: MutationRecordType.ATTRIBUTES,
          target: this,
          attributeName: name,
          attributeNamespace: namespaceURI,
          oldValue,
        },
        [
          TransferrableMutationType.ATTRIBUTES,
          this[TransferrableKeys.index],
          storeString(name),
          storeString(namespaceURI),
          0, // 0 means no value
        ],
      );
    }
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributeNS
   * @param namespaceURI attribute namespace
   * @param name attribute name
   * @return Boolean indicating if the element has the specified attribute.
   */
  public hasAttributeNS(namespaceURI: NamespaceURI, name: string): boolean {
    return this.attributes.some(matchAttrPredicate(namespaceURI, name));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
   * @param names contains one more more classnames to match on. Multiples are space seperated, indicating an AND operation.
   * @return Element array with matching classnames
   */
  public getElementsByClassName(names: string): Array<Element> {
    const inputClassList = names.split(' ');
    // TODO(KB) – Compare performance of [].some(value => DOMTokenList.contains(value)) and regex.
    // const classRegex = new RegExp(classNames.split(' ').map(name => `(?=.*${name})`).join(''));

    return matchChildrenElements(this, (element) => inputClassList.some((inputClassName) => element.classList.contains(inputClassName)));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
   * @param tagName the qualified name to look for. The special string "*" represents all elements.
   * @return Element array with matching tagnames
   */
  public getElementsByTagName(tagName: string): Array<Element> {
    const lowerTagName = toLower(tagName);
    return matchChildrenElements(
      this,
      tagName === '*'
        ? (_) => true
        : (element) => (element.namespaceURI === HTML_NAMESPACE ? element.localName === lowerTagName : element.tagName === tagName),
    );
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByName
   * @param name value of name attribute elements must have to be returned
   * @return Element array with matching name attributes
   */
  public getElementsByName(name: any): Array<Element> {
    const stringName = '' + name;
    return matchChildrenElements(this, (element) => element.getAttribute('name') === stringName);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
   * @param deep boolean determines if the clone should include a recursive copy of all childNodes.
   * @return Element containing all current attributes and potentially childNode clones of the Element requested to be cloned.
   */
  public cloneNode(deep: boolean = false): Element {
    const clone: Element = this.ownerDocument.createElementNS(
      this.namespaceURI,
      this.namespaceURI === HTML_NAMESPACE ? toLower(this.tagName) : this.tagName,
    );
    this.attributes.forEach((attr) => clone.setAttribute(attr.name, attr.value));
    if (deep) {
      this.childNodes.forEach((child: Node) => clone.appendChild(child.cloneNode(deep)));
    }
    return clone;
  }

  /**
   * Return the ClientRect for an Element once determined by the main thread.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
   * @return Promise<ClientRect>
   *
   * Note: Edge and IE11 do not return the x/y value, but top/left are equivalent. Normalize the values here.
   */
  public getBoundingClientRectAsync(): Promise<ClientRect> {
    const defaultValue = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    return new Promise((resolve) => {
      const messageHandler = ({ data }: { data: MessageToWorker }) => {
        if (
          data[TransferrableKeys.type] === MessageType.GET_BOUNDING_CLIENT_RECT &&
          (data as BoundingClientRectToWorker)[TransferrableKeys.target][0] === this[TransferrableKeys.index]
        ) {
          this.ownerDocument.removeGlobalEventListener('message', messageHandler);
          const transferredBoundingClientRect: TransferrableBoundingClientRect = (data as BoundingClientRectToWorker)[TransferrableKeys.data];
          resolve({
            top: transferredBoundingClientRect[0],
            right: transferredBoundingClientRect[1],
            bottom: transferredBoundingClientRect[2],
            left: transferredBoundingClientRect[3],
            width: transferredBoundingClientRect[4],
            height: transferredBoundingClientRect[5],
            x: transferredBoundingClientRect[0],
            y: transferredBoundingClientRect[3],
          });
        }
      };

      if (!this.ownerDocument.addGlobalEventListener || !this.isConnected) {
        // Elements run within Node runtimes are missing addEventListener as a global.
        // In this case, treat the return value the same as a disconnected node.
        resolve(defaultValue);
      } else {
        this.ownerDocument.addGlobalEventListener('message', messageHandler);
        transfer(this.ownerDocument as Document, [TransferrableMutationType.GET_BOUNDING_CLIENT_RECT, this[TransferrableKeys.index]]);
        setTimeout(resolve, 500, defaultValue); // TODO: Why a magical constant, define and explain.
      }
    });
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
  click() {
    const event = new Event('click', {});
    event.target = this;
    this.dispatchEvent(event);
  }

  public get classList(): DOMTokenList {
    return this._classList || (this._classList = new DOMTokenList(this, 'class'));
  }
}
synchronizedAccessor(Element, 'classList', 'className');
reflectProperties([{ id: [''] }], Element);
