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

import { Node, NodeType, NodeName, NamespaceURI } from './Node';
import { DOMTokenList } from './DOMTokenList';
import { Attr, toString as attrsToString, matchPredicate as matchAttrPredicate } from './Attr';
import { mutate } from '../MutationObserver';
import { MutationRecordType } from '../MutationRecord';
import { NumericBoolean } from '../../utils';
import { Text } from './Text';
import { CSSStyleDeclaration } from '../css/CSSStyleDeclaration';
import { matchChildrenElements } from './matchElements';
import { reflectProperties } from './enhanceElement';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { HydrateableNode } from '../../transfer/TransferrableNodes';
import { store as storeString } from '../StringMapping';
import { toLower } from '../../utils';

const isElementPredicate = (node: Node): boolean => node.nodeType === NodeType.ELEMENT_NODE;

export const NODE_NAME_MAPPING: { [key: string]: typeof Element } = {};
export function registerSubclass(nodeName: NodeName, subclass: typeof Element): void {
  NODE_NAME_MAPPING[nodeName] = subclass;
}

export class Element extends Node {
  public attributes: Attr[] = [];
  public propertyBackedAttributes_: { [key: string]: [() => string | null, (value: string) => string | boolean] } = {};
  public classList: DOMTokenList = new DOMTokenList(Element, this, 'class', 'classList', 'className');
  public style: CSSStyleDeclaration = new CSSStyleDeclaration(this);
  public namespaceURI: NamespaceURI;

  constructor(nodeType: NodeType, nodeName: NodeName, namespaceURI: NamespaceURI) {
    super(nodeType, nodeName);
    this.namespaceURI = namespaceURI;
    this._transferredFormat_ = {
      [TransferrableKeys._index_]: this._index_,
      [TransferrableKeys.transferred]: NumericBoolean.TRUE,
    };
    this._creationFormat_ = {
      [TransferrableKeys._index_]: this._index_,
      [TransferrableKeys.transferred]: NumericBoolean.FALSE,
      [TransferrableKeys.nodeType]: this.nodeType,
      [TransferrableKeys.nodeName]: storeString(this.nodeName),
      [TransferrableKeys.namespaceURI]: this.namespaceURI === null ? undefined : storeString(this.namespaceURI),
    };
  }

  /**
   * When hydrating the tree, we need to send HydrateableNode representations
   * for the main thread to process and store items from for future modifications.
   */
  public hydrate(): HydrateableNode {
    return Object.assign(
      {},
      this._creationFormat_,
      this.childNodes.length > 0
        ? {
            [TransferrableKeys.childNodes]: this.childNodes.map(node => node.hydrate()),
          }
        : {},
      this.attributes.length > 0
        ? {
            [TransferrableKeys.attributes]: this.attributes.map(attribute => [
              storeString(attribute.namespaceURI || 'null'),
              storeString(attribute.name),
              storeString(attribute.value),
            ]),
          }
        : {},
    );
  }

  // Unimplemented properties
  // Element.clientHeight – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
  // Element.clientLeft – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientLeft
  // Element.clientTop – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientTop
  // Element.clientWidth – https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
  // Element.querySelectorAll – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
  // set Element.innerHTML – https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
  // Element.localName – https://developer.mozilla.org/en-US/docs/Web/API/Element/localName
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
  // Element.querySelector() – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
  // Element.querySelectorAll() – https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
  // Element.releasePointerCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/releasePointerCapture
  // Element.requestFullscreen() – https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
  // Element.requestPointerLock() – https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock
  // Element.scrollIntoView() – https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  // Element.setCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/setCapture
  // Element.setPointerCapture() – https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture

  // Mixins not implemented
  // Slotable.assignedSlot – https://developer.mozilla.org/en-US/docs/Web/API/Slotable/assignedSlot

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML
   * @return string representation of serialized HTML describing the Element and its descendants.
   */
  get outerHTML(): string {
    return `<${[this.nodeName, attrsToString(this.attributes)].join(' ').trim()}>${this.innerHTML}</${this.nodeName}>`;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
   * @return string representation of serialized HTML describing the Element's descendants.
   */
  get innerHTML(): string {
    const childNodes = this.childNodes;

    if (childNodes.length) {
      return childNodes.map(child => (child.nodeType === NodeType.ELEMENT_NODE ? child.outerHTML : child.textContent)).join('');
    }
    return '';
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
   * @param text new text replacing all childNodes content.
   */
  set textContent(text: string) {
    // TODO(KB): Investigate removing all children in a single .splice to childNodes.
    this.childNodes.forEach(childNode => childNode.remove());
    this.appendChild(new Text(text));
  }

  /**
   * Getter returning the text representation of Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
   * @return text from all childNodes.
   */
  get textContent(): string {
    return super.textContent;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
   * @return string tag name (i.e 'div')
   */
  get tagName(): string {
    return this.nodeName;
  }

  /**
   * Getter returning children of an Element that are Elements themselves.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
   * @return Element objects that are children of this ParentNode, omitting all of its non-element nodes.
   */
  get children(): Element[] {
    return this.childNodes.filter(isElementPredicate) as Element[];
  }

  /**
   * Getter returning the number of child elements of a Element.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/childElementCount
   * @return number of child elements of the given Element.
   */
  get childElementCount(): number {
    return this.children.length;
  }

  /**
   * Getter returning the first Element in Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/firstElementChild
   * @return first childNode that is also an element.
   */
  get firstElementChild(): Element | null {
    return (this.childNodes.find(isElementPredicate) as Element) || null;
  }

  /**
   * Getter returning the last Element in Element.childNodes.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/lastElementChild
   * @return first childNode that is also an element.
   */
  get lastElementChild(): Element | null {
    const children = this.children;
    return children[children.length - 1] || null;
  }

  /**
   * Sets the value of an attribute on this element using a null namespace.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
   * @param name attribute name
   * @param value attribute value
   */
  public setAttribute(name: string, value: string): void {
    this.setAttributeNS(null, name, value);
  }

  /**
   * Get the value of an attribute on this Element with the null namespace.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
   * @param name attribute name
   * @return value of a specified attribute on the element, or null if the attribute doesn't exist.
   */
  public getAttribute(name: string): string | null {
    return this.getAttributeNS(null, name);
  }

  /**
   * Remove an attribute from this element in the null namespace.
   *
   * Method returns void, so it is not chainable.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute
   * @param name attribute name
   */
  public removeAttribute(name: string): void {
    this.removeAttributeNS(null, name);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute
   * @param name attribute name
   * @return Boolean indicating if the element has the specified attribute.
   */
  public hasAttribute(name: string): boolean {
    return this.hasAttributeNS(null, name);
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
  public setAttributeNS(namespaceURI: NamespaceURI, name: string, value: string): void {
    if (this.propertyBackedAttributes_[name] !== undefined) {
      if (!this.attributes.find(matchAttrPredicate(namespaceURI, name))) {
        this.attributes.push({
          namespaceURI,
          name,
          value,
        });
      }
      this.propertyBackedAttributes_[name][1](value);
      return;
    }

    const oldValue = this.storeAttributeNS_(namespaceURI, name, value);
    mutate({
      type: MutationRecordType.ATTRIBUTES,
      target: this,
      attributeName: name,
      attributeNamespace: namespaceURI,
      value,
      oldValue,
    });
  }

  public storeAttributeNS_(namespaceURI: NamespaceURI, name: string, value: string): string {
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
      return this.propertyBackedAttributes_[name] !== undefined ? this.propertyBackedAttributes_[name][0]() : attr.value;
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

      mutate({
        type: MutationRecordType.ATTRIBUTES,
        target: this,
        attributeName: name,
        attributeNamespace: namespaceURI,
        oldValue,
      });
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
  public getElementsByClassName(names: string): Element[] {
    const inputClassList = names.split(' ');
    // TODO(KB) – Compare performance of [].some(value => DOMTokenList.contains(value)) and regex.
    // const classRegex = new RegExp(classNames.split(' ').map(name => `(?=.*${name})`).join(''));

    return matchChildrenElements(this, element => inputClassList.some(inputClassName => element.classList.contains(inputClassName)));
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
   * @param tagName the qualified name to look for. The special string "*" represents all elements.
   * @return Element array with matching tagnames
   */
  public getElementsByTagName(tagName: string): Element[] {
    return matchChildrenElements(this, tagName === '*' ? _ => true : element => element.tagName === tagName);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
   * @param selector the selector we are trying to match for.
   * @return Element with matching selector.
   */
  public querySelector(selector: string): Element | null {
    let matches: Element[] | null = this.querySelectorAll(selector);
    return matches ? matches[0] : null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
   * @param selector the selector we are trying to match for.
   * @return Element with matching selector.
   */
  public querySelectorAll(selector: string): Element[] | null {
    let matches: Element[] | null = null;
    //As per spec: https://dom.spec.whatwg.org/#scope-match-a-selectors-string
    // First, parse the selector
    const containsAttrReference = selector.indexOf('[') !== -1 && selector.indexOf(']') !== -1;
    let elementSelector = selector;
    let attrSelector: string | null = null;
    if (containsAttrReference) {
      elementSelector = selector.substring(0, selector.indexOf('['));
      attrSelector = selector.substring(selector.indexOf('['), selector.indexOf(']') + 1);
    }
    //TODO(nainar): Parsing selectors is needed when we add in more complex selectors.
    // Second, find all the matching elements on the Document
    if (selector[0] === '[') {
      matches = matchChildrenElements(this.ownerDocument.documentElement, function(element: Element) {
        return matchAttrReference(selector, element);
      });
    } else if (elementSelector[0] === '#') {
      matches = matchChildrenElements(this.ownerDocument.documentElement, function(element: Element) {
        return element.id === elementSelector.substr(1) && (containsAttrReference ? matchAttrReference(attrSelector, element) : true);
      });
    } else if (elementSelector[0] === '.') {
      matches = matchChildrenElements(this.ownerDocument.documentElement, function(element: Element) {
        return element.classList.contains(elementSelector.substr(1)) && (containsAttrReference ? matchAttrReference(attrSelector, element) : true);
      });
    } else {
      matches = matchChildrenElements(this.ownerDocument.documentElement, function(element: Element) {
        return element.tagName === toLower(elementSelector) && (containsAttrReference ? matchAttrReference(attrSelector, element) : true);
      });
    }
    // Third, filter to return elements that exist within the querying element's descendants.
    if (matches) {
      return matches.filter(element => this.contains(element) && this !== element);
    }
    //TODO(nainar): More complex selectors
    return [];
  }
}
reflectProperties([{ id: [''] }], Element);

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
 * @param attrSelector the selector we are trying to match for.
 * @param element the element being tested.
 * @return boolean for whether we match the condition
 */
const matchAttrReference = (attrSelector: string | null, element: Element): boolean => {
  if (!attrSelector) {
    return false;
  }
  const equalPos: number = attrSelector.indexOf('=');
  const selectorLength: number = attrSelector.length;
  const caseInsensitive = attrSelector.charAt(selectorLength - 2) === 'i';
  let endPos = selectorLength - 1;
  if (caseInsensitive) {
    endPos -= 2;
  }
  if (equalPos !== -1) {
    switch (attrSelector.charAt(equalPos - 1)) {
      case '~': {
        // TODO(nainar): This doesn't work - I suck at reading English. This also doesn't have tests.
        // const attrString = attrSelector.substring(1, equalPos - 1);
        // const value = attrSelector.substring(equalPos + 1, endPos);
        // const attrValue = element.getAttribute(attrString);
        // return (
        //   !!attrValue &&
        //   attrValue.indexOf(value) !== -1 &&
        //   (attrValue.charAt(attrValue.indexOf(value) - 1) === ' ' || attrValue.indexOf(value) === 0) &&
        //   (attrValue.charAt(attrValue.indexOf(value) + 1) === ' ' || attrValue.indexOf(value) === attrValue.length - 1)
        // );
      }
      case '|': {
        const attrString = attrSelector.substring(1, equalPos - 1);
        const value = attrSelector.substring(equalPos + 1, endPos);
        const attrValue = element.getAttribute(attrString);
        return (
          !!attrValue &&
          (caseInsensitive
            ? toLower(attrValue) === toLower(value) || toLower(attrValue) === `${toLower(value)}-`
            : attrValue === value || attrValue === `${value}-`)
        );
      }
      case '^': {
        const attrString = attrSelector.substring(1, equalPos - 1);
        const value = attrSelector.substring(equalPos + 1, endPos);
        const attrValue = element.getAttribute(attrString);
        return !!attrValue && (caseInsensitive ? toLower(attrValue).startsWith(toLower(value)) : attrValue.startsWith(value));
      }
      case '$': {
        const attrString = attrSelector.substring(1, equalPos - 1);
        const value = attrSelector.substring(equalPos + 1, endPos);
        const attrValue = element.getAttribute(attrString);
        return !!attrValue && (caseInsensitive ? toLower(attrValue).endsWith(toLower(value)) : attrValue.endsWith(value));
      }
      case '*': {
        const attrString = attrSelector.substring(1, equalPos - 1);
        const value = attrSelector.substring(equalPos + 1, endPos);
        const attrValue = element.getAttribute(attrString);
        return !!attrValue && (caseInsensitive ? toLower(attrValue).indexOf(toLower(value)) !== -1 : attrValue.indexOf(value) !== -1);
      }
      default: {
        const attr = attrSelector.substring(1, equalPos);
        const value = attrSelector.substring(equalPos + 1, endPos);
        const attrValue = element.getAttribute(attr);
        return !!attrValue && (caseInsensitive ? toLower(attrValue) === toLower(value) : attrValue === value);
      }
    }
  } else {
    return element.hasAttribute(attrSelector.substring(1, endPos));
  }
};
