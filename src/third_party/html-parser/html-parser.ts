import { Element } from '../../worker-thread/dom/Element';
import { Node } from '../../worker-thread/dom/Node';
import { SVG_NAMESPACE, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { toLower } from '../../utils';

interface Elements {
  [key: string]: boolean;
}

interface ElementMapping {
  [key: string]: Elements;
}

function arr_back<T>(arr: T[]) {
  return arr[arr.length - 1];
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
const kMarkupPattern = /<!--([^]*)-->|<(\/?)([a-z][-.0-9_a-z]*)([^>]*?)(\/?)>/gi;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
const kAttributePattern = /(^|\s)([^\s"'>\/=]+)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/gi;

const kSelfClosingElements: Elements = {
  AREA: true,
  BASE: true,
  BR: true,
  COL: true,
  HR: true,
  IMG: true,
  INPUT: true,
  LINK: true,
  META: true,
  PARAM: true,
  SOURCE: true,
  TRACK: true,
  WBR: true,
};
const kElementsClosedByOpening: ElementMapping = {
  LI: { LI: true },
  DT: { DT: true, DD: true },
  DD: { DD: true, DT: true },
  P: {
    ADDRESS: true,
    ARTICLE: true,
    ASIDE: true,
    BLOCKQUOTE: true,
    DETAILS: true,
    DIV: true,
    DL: true,
    FIELDSET: true,
    FIGCAPTION: true,
    FIGURE: true,
    FOOTER: true,
    FORM: true,
    H1: true,
    H2: true,
    H3: true,
    H4: true,
    H5: true,
    H6: true,
    HEADER: true,
    HR: true,
    MAIN: true,
    NAV: true,
    OL: true,
    P: true,
    PRE: true,
    SECTION: true,
    TABLE: true,
    UL: true,
  },
  RT: { RT: true, RP: true },
  RP: { RT: true, RP: true },
  OPTGROUP: { OPTGROUP: true },
  OPTION: { OPTION: true, OPTGROUP: true },
  THEAD: { TBODY: true, TFOOT: true },
  TBODY: { TBODY: true, TFOOT: true },
  TR: { TR: true },
  TD: { TD: true, TH: true },
  TH: { TD: true, TH: true },
};
const kElementsClosedByClosing: ElementMapping = {
  LI: { UL: true, OL: true },
  A: { DIV: true },
  B: { DIV: true },
  I: { DIV: true },
  P: { DIV: true },
  TD: { TR: true, TABLE: true },
  TH: { TR: true, TABLE: true },
};
const kBlockTextElements: Elements = {
  SCRIPT: true,
  NOSCRIPT: true,
  STYLE: true,
  PRE: true,
};

/**
 * Parses HTML and returns a root element
 * Parse a chuck of HTML source.
 * @param  {string} data HTML in string format.
 * @param {!Element} root The element to use as root.
 * @return {Element}      root element
 */
export function parse(data: string, rootElement: Element) {
  const ownerDocument = rootElement.ownerDocument;
  const root = ownerDocument.createElementNS(rootElement.namespaceURI, rootElement.localName);

  let currentParent = root as Node;
  let currentNamespace = root.namespaceURI;
  const stack = [root as Node];
  let lastTextPos = 0;
  let match: RegExpExecArray | null;
  data = '<q>' + data + '</q>';
  const tagsClosed = [] as string[];

  if (currentNamespace !== SVG_NAMESPACE && currentNamespace !== HTML_NAMESPACE) {
    throw new Error('Namespace not supported: ' + currentNamespace);
  }

  while ((match = kMarkupPattern.exec(data))) {
    const commentContents = match[1]; // <!--contents-->
    let beginningSlash = match[2]; // ... </ ...
    const tagName = match[3];
    const matchAttributes = match[4];
    const endSlash = match[5]; // ... /> ...

    if (lastTextPos < match.index) {
      // if has content
      const text = data.slice(lastTextPos, match.index);
      currentParent.appendChild(ownerDocument.createTextNode(text));
    }
    lastTextPos = kMarkupPattern.lastIndex;
    if (commentContents !== undefined) {
      // this is a comment
      currentParent.appendChild(ownerDocument.createComment(commentContents));
      continue;
    }

    const normalizedTagName = tagName.toUpperCase();

    if (normalizedTagName === 'SVG') {
      currentNamespace = beginningSlash ? HTML_NAMESPACE : SVG_NAMESPACE;
    }

    if (!beginningSlash) {
      // not </ tags
      if (!endSlash && kElementsClosedByOpening[currentParent.tagName]) {
        if (kElementsClosedByOpening[currentParent.tagName][normalizedTagName]) {
          stack.pop();
          currentParent = arr_back(stack);
        }
      }

      const childToAppend = ownerDocument.createElementNS(currentNamespace, currentNamespace === HTML_NAMESPACE ? toLower(tagName) : tagName);

      for (let attMatch; (attMatch = kAttributePattern.exec(matchAttributes)); ) {
        const attrName = attMatch[2];
        const attrValue = attMatch[4] || attMatch[5] || attMatch[6];
        childToAppend.setAttribute(attrName, attrValue);
      }

      currentParent = currentParent.appendChild(childToAppend);

      stack.push(currentParent);
      if (kBlockTextElements[normalizedTagName]) {
        // a little test to find next </script> or </style> ...
        const closeMarkup = '</' + toLower(normalizedTagName) + '>';
        const index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
        if (index == -1) {
          throw new Error('Close markup not found.');
        } else {
          kMarkupPattern.lastIndex = index;
        }
      }
    }

    if (tagName === 'foreignObject') {
      currentNamespace = beginningSlash ? SVG_NAMESPACE : HTML_NAMESPACE;
    }

    if (beginningSlash || endSlash || kSelfClosingElements[normalizedTagName]) {
      // </ or /> or <br> etc.
      while (true) {
        if (stack.length <= 1) {
          break;
        }

        if (currentParent.nodeName.toUpperCase() == normalizedTagName) {
          stack.pop();
          currentParent = arr_back(stack);
          break;
        } else {
          // Trying to close current tag, and move on
          if (kElementsClosedByClosing[currentParent.tagName]) {
            if (kElementsClosedByClosing[currentParent.tagName][normalizedTagName]) {
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

  for (const node of stack) {
    if (tagsClosed[tagsClosed.length - 1] == node.nodeName) {
      stack.pop();
      tagsClosed.pop();
      currentParent = arr_back(stack);
    } else break;
  }

  const valid = stack.length === 1;

  if (!valid) {
    throw new Error('Attempting to parse invalid HTML content.');
  }

  const wrapper = root.firstChild;

  if (wrapper) {
    wrapper.parentNode = null;
    wrapper.childNodes.forEach((node: Node) => {
      node.parentNode = null;
    });
    return wrapper;
  }

  throw new Error('Attempting to parse invalid HTML.');
}
