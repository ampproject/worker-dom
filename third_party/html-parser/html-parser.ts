import { decode } from 'he';

export enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  ENTITY_NODE = 6,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
  NOTATION_NODE = 12,
}

export abstract class Node {
  nodeName: string;
  nodeType: NodeType;
  childNodes = [] as Node[];
  text: string;
  parentNode: Node;
}

export class Text extends Node {
  nodeType = NodeType.TEXT_NODE;
  constructor(value: string) {
    super();
    this.text = value;
  }
}

export class Element extends Node {
  nodeType = NodeType.ELEMENT_NODE;
  private _attrs: Attributes;
  private _rawAttrs: RawAttributes;
  private rawAttrs: string;
  constructor(nodeName: string, rawAttrs = '') {
    super();
    this.nodeName = nodeName;
    this.rawAttrs = rawAttrs || '';
    this.childNodes = [];
  }

  /**
   * Append a child node to childNodes
   * @param  {Node} node node to append
   * @return {Node}      node appended
   */
  public appendChild<T extends Node = Node>(node: T) {
    this.childNodes.push(node);
    if (node instanceof Element) {
      node.parentNode = this;
    }
    return node;
  }

  /**
   * Get attributes
   * @return {Object} parsed and unescaped attributes
   */
  get attributes() {
    if (this._attrs) return this._attrs;
    this._attrs = {};
    const attrs = this.rawAttributes;
    for (const key in attrs) {
      this._attrs[key] = decode(attrs[key]);
    }
    return this._attrs;
  }

  /**
   * Get escaped (as-it) attributes
   * @return {Object} parsed attributes
   */
  get rawAttributes() {
    if (this._rawAttrs) return this._rawAttrs;
    const attrs = {} as RawAttributes;
    if (this.rawAttrs) {
      const re = /\b([a-z][a-z0-9\-]*)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/gi;
      let match: RegExpExecArray | null;
      while ((match = re.exec(this.rawAttrs))) {
        attrs[match[1]] = match[3] || match[4] || match[5];
      }
    }
    this._rawAttrs = attrs;
    return attrs;
  }
}

export class Comment extends Node {
  nodeType = NodeType.COMMENT_NODE;
  constructor(value: string) {
    super();
    this.text = value;
  }
}

export interface Elements {
  [key: string]: boolean;
}

export interface ElementMapping {
  [key: string]: Elements;
}

export interface KeyAttributes {
  id?: string;
  class?: string;
}

export interface Attributes {
  [key: string]: string;
}

export interface RawAttributes {
  [key: string]: string;
}

function arr_back<T>(arr: T[]) {
  return arr[arr.length - 1];
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
const kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>/gi;
const kAttributePattern = /(^|\s)(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/gi;
const kSelfClosingElements: Elements = {
  area: true,
  base: true,
  br: true,
  col: true,
  hr: true,
  img: true,
  input: true,
  link: true,
  meta: true,
};

const kElementsClosedByOpening: ElementMapping = {
  li: { li: true },
  p: { p: true, div: true },
  b: { div: true },
  td: { td: true, th: true },
  th: { td: true, th: true },
  h1: { h1: true },
  h2: { h2: true },
  h3: { h3: true },
  h4: { h4: true },
  h5: { h5: true },
  h6: { h6: true },
};
const kElementsClosedByClosing: ElementMapping = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true },
};
const kBlockTextElements: Elements = {
  script: true,
  noscript: true,
  style: true,
  pre: true,
};

/**
 * Parses HTML and returns a root element
 * Parse a chuck of HTML source.
 * @param  {string} data HTML in string format.
 * @return {Element}      root element
 */
export function parse(data: string) {
  const root = new Element('' /* nodeName */);
  let currentParent = root;
  const stack = [root];
  let lastTextPos = -1;
  let match: RegExpExecArray | null;
  while ((match = kMarkupPattern.exec(data))) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        // if has content
        const text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
        currentParent.appendChild(new Text(text));
      }
    }
    lastTextPos = kMarkupPattern.lastIndex;
    if (match[0][1] == '!') {
      // this is a comment
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        const text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
        currentParent.appendChild(new Comment(text));
      }
    }

    // we only want tags in upper case
    match[2] = match[2].toUpperCase();

    if (!match[1]) {
      // not </ tags
      let attrs: Attributes = {};
      for (let attMatch; (attMatch = kAttributePattern.exec(match[3])); ) {
        attrs[attMatch[2]] = attMatch[4] || attMatch[5] || attMatch[6];
      }

      if (!match[4] && kElementsClosedByOpening[currentParent.nodeName]) {
        if (kElementsClosedByOpening[currentParent.nodeName][match[2]]) {
          stack.pop();
          currentParent = arr_back(stack);
        }
      }
      currentParent = currentParent.appendChild(new Element(match[2], match[3]));

      stack.push(currentParent);
      if (kBlockTextElements[match[2]]) {
        // a little test to find next </script> or </style> ...
        let closeMarkup = '</' + match[2] + '>';
        let index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
        if (index == -1) {
          lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
        } else {
          lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
          match[1] = 'true';
        }
      }
    }
    if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
      // </ or /> or <br> etc.
      while (true) {
        if (currentParent.nodeName == match[2]) {
          stack.pop();
          currentParent = arr_back(stack);
          break;
        } else {
          // Trying to close current tag, and move on
          if (kElementsClosedByClosing[currentParent.nodeName]) {
            if (kElementsClosedByClosing[currentParent.nodeName][match[2]]) {
              stack.pop();
              currentParent = arr_back(stack);
              continue;
            }
          }
          // Use aggressive strategy to handle unmatching markups.
          break;
        }
      }
    }
  }
  type Response = (Element | Text) & { valid: boolean };
  const valid = !!(stack.length === 1);

  if (!valid) {
    // throw (fail)
  }

  const response = new Text(data) as Response;
  response.valid = valid;
  return response;
}
