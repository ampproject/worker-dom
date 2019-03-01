import { Comment } from '../../worker-thread/dom/Comment';
import { Element } from '../../worker-thread/dom/Element';
import { Node } from '../../worker-thread/dom/Node';
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
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
const kAttributePattern = /(^|\s)([^\s"'>\/=]+)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/gi;

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
  const ownerDocument = rootElement.ownerDocument;
  // this can be stubbed
  const root = new Element(rootElement.nodeType, rootElement.nodeName, rootElement.namespaceURI, ownerDocument);

  let currentParent = root as Node;
  const stack = [root as Node];
  let lastTextPos = 0;
  let match: RegExpExecArray | null;
  data = '<div>' + data + '</div>';

  while ((match = kMarkupPattern.exec(data))) {
    if (lastTextPos > -1) {
      if (lastTextPos < match.index) {
        // if has content
        const text = data.slice(lastTextPos, match.index);
        currentParent.appendChild(new Text(text, ownerDocument));
      }
    }
    lastTextPos = kMarkupPattern.lastIndex;
    if (match[0][1] == '!') {
      // this is a comment
      const text = match[0].slice(4, -3);
      currentParent.appendChild(new Comment(text, ownerDocument));
      continue;
    }

    // we only want tags in upper case
    match[2] = match[2].toUpperCase();

    if (!match[1]) {
      // not </ tags

      if (!match[4] && kElementsClosedByOpening[currentParent.tagName]) {
        if (kElementsClosedByOpening[currentParent.tagName][match[2].toLowerCase()]) {
          stack.pop();
          currentParent = arr_back(stack);
        }
      }
      const childToAppend = new Element(currentParent.nodeType, match[2], currentParent.namespaceURI, ownerDocument);

      let attrs: Attributes = {};
      for (let attMatch; (attMatch = kAttributePattern.exec(match[3])); ) {
        attrs[attMatch[2]] = attMatch[4] || attMatch[5] || attMatch[6];
        childToAppend.setAttribute(attMatch[2], attrs[attMatch[2]]);
      }

      currentParent = currentParent.appendChild(childToAppend);

      stack.push(currentParent);
      if (kBlockTextElements[match[2]]) {
        // a little test to find next </script> or </style> ...
        let closeMarkup = '</' + match[2] + '>';
        let index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
        if (index == -1) {
          throw new Error('Close markup not found.');
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

  const valid = stack.length === 1;

  if (!valid) {
    throw new Error('Attempting to parse invalid HTML content.');
  }

  root.childNodes.forEach(node => {
    if (node instanceof Element) {
      node.parentNode = null;
    }
  });

  // remove the added <div>
  if (root.firstChild) {
    root.firstChild.childNodes.forEach(node => {
      if (node instanceof Node) {
        node.parentNode = null;
      }
    });
    const response = { node: root.firstChild, valid: valid };
    return response;
  }

  throw new Error('Attempting to parse invalid HTML.');
}
