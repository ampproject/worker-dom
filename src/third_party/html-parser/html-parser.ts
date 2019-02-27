import { Comment } from '../../worker-thread/dom/Comment';
import { Element } from '../../worker-thread/dom/Element';
import { Node } from '../../worker-thread/dom/Node';
import { NodeType } from '../../transfer/TransferrableNodes';
import { Text } from '../../worker-thread/dom/Text';

interface Elements {
  [key: string]: boolean;
}

interface ElementMapping {
  [key: string]: Elements;
}

interface Attributes {
  [key: string]: string;
}

function arr_back<T>(arr: T[]) {
  return arr[arr.length - 1];
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
const kMarkupPattern = /<!--[^]*?-->|<(\/?)([a-z][-.0-9_a-z]*)([^>]*?)(\/?)>/gi;
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
 * @param {!Element} root The element to use as root.
 * @return {Element}      root element
 */
export function parse(data: string, rootElement: Element) {
  // this can be stubbed
  const root = new Element(rootElement.nodeType, rootElement.nodeName, rootElement.namespaceURI, rootElement.ownerDocument);

  let currentParent = root as Node;
  const stack = [root as Node];
  let lastTextPos = -1;
  let match: RegExpExecArray | null;

  // this will ensure detection of all text nodes.
  data = '<div>' + data + '</div>';

  while ((match = kMarkupPattern.exec(data))) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        // if has content
        const text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
        currentParent.appendChild(new Text(text, rootElement.ownerDocument));
      }
    }
    lastTextPos = kMarkupPattern.lastIndex;
    if (match[0][1] == '!') {
      // this is a comment
      if (match[0].length > 7 /* 7 is the minimum: <!----> */) {
        const text = match[0].substring(4, match[0].length - 3);
        currentParent.appendChild(new Comment(text, rootElement.ownerDocument));
      }
      continue;
    }

    // we only want tags in upper case
    match[2] = match[2].toUpperCase();

    if (!match[1]) {
      // not </ tags
      let attrs: Attributes = {};
      for (let attMatch; (attMatch = kAttributePattern.exec(match[3])); ) {
        attrs[attMatch[2]] = attMatch[4] || attMatch[5] || attMatch[6];
      }

      if (!match[4] && kElementsClosedByOpening[currentParent.tagName]) {
        if (kElementsClosedByOpening[currentParent.tagName][match[2]]) {
          stack.pop();
          currentParent = arr_back(stack);
        }
      }
      const childToAppend = new Element(NodeType.ELEMENT_NODE, match[2], currentParent.namespaceURI, currentParent.ownerDocument);

      for (const key in attrs) {
        childToAppend.setAttribute(key, attrs[key]);
      }

      currentParent = currentParent.appendChild(childToAppend);

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
          if (kElementsClosedByClosing[currentParent.tagName]) {
            if (kElementsClosedByClosing[currentParent.tagName][match[2]]) {
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
    throw new Error('Attempting to parse invalid tag.');
  }

  const response = root as Response;
  response.valid = valid;
  while (stack.length > 1) {
    // Handle each error elements.
    const last = stack.pop();
    const oneBefore = arr_back(stack);
    if (last && last.parentNode && (last.parentNode as Element).parentNode) {
      if (last.parentNode === oneBefore && last.tagName === oneBefore.tagName) {
        // Pair error case <h3> <h3> handle : Fixes to <h3> </h3>
        oneBefore.removeChild(last);
        last.childNodes.forEach(child => {
          (oneBefore.parentNode as Element).appendChild(child);
        });
        stack.pop();
      } else {
        // Single error  <div> <h3> </div> handle: Just removes <h3>
        oneBefore.removeChild(last);
        last.childNodes.forEach(child => {
          oneBefore.appendChild(child);
        });
      }
    } else {
      // If it's final element just skip.
    }
  }
  response.childNodes.forEach(node => {
    if (node instanceof Element) {
      node.parentNode = null;
    }
  });

  // remove the added <div>
  if (response && response.firstChild) {
    response.firstChild.childNodes.forEach(node => {
      if (node instanceof Node) {
        node.parentNode = null;
      }
    });
    return response.firstChild;
  }

  throw new Error('Attempting to parse invalid HTML.');
}
