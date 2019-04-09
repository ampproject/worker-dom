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

import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { Text } from '../../worker-thread/dom/Text';
import { Comment } from '../../worker-thread/dom/Comment';
import { NodeType, SVG_NAMESPACE, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { createTestingDocument } from '../DocumentCreation';
import { HTMLInputElement } from '../../worker-thread/dom/HTMLInputElement';

const test = anyTest as TestInterface<{
  node: Element;
  child: Element;
  text: Text;
  comment: Comment;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    child: document.createElement('div'),
    text: document.createTextNode('text'),
    comment: document.createComment('comment'),
  };
});

test('element with no children', t => {
  const { node } = t.context;

  t.is(node.innerHTML, '');
  node.className = 'test';
  t.is(node.innerHTML, '');
});

test('element with a child', t => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(node.innerHTML, '<div></div>');
});

test('element with text', t => {
  const { node, text } = t.context;

  node.appendChild(text);
  t.is(node.innerHTML, 'text');
});

test('element with comment', t => {
  const { node, comment } = t.context;

  node.appendChild(comment);
  t.is(node.innerHTML, '<!--comment-->');
});

test('set nothing', t => {
  const { node } = t.context;
  node.innerHTML = '';
  t.is(node.hasChildNodes(), false);
});

test('set replaces children', t => {
  const { node, child } = t.context;
  node.appendChild(child);
  node.innerHTML = '';
  t.is(node.hasChildNodes(), false);
});

test('set an element node', t => {
  const { node } = t.context;
  node.innerHTML = '<div></div>';
  t.is(node.childNodes.length, 1);

  const child = node.firstChild!;
  t.is(child.nodeType, NodeType.ELEMENT_NODE);
  t.is(child.nodeName, 'DIV');
});

test('set a text node', t => {
  const { node } = t.context;
  const testString = 'Hello, World!';
  node.innerHTML = testString;
  t.is(node.childNodes.length, 1);

  const child = node.firstChild!;
  t.is(child.nodeType, NodeType.TEXT_NODE);
  t.is(child.textContent, testString);
});

test('set comment node', t => {
  const { node } = t.context;
  const testString = 'this is a comment';
  node.innerHTML = '<!--' + testString + '-->';
  t.is(node.childNodes.length, 1);

  const child = node.firstChild!;
  t.is(child.nodeType, NodeType.COMMENT_NODE);
  t.is(child.textContent, testString);
});

test('set nested elements', t => {
  const { node } = t.context;
  node.innerHTML = '<div><div></div></div>';
  t.is(node.childNodes.length, 1);

  const child = node.firstChild!;
  t.is(child.childNodes.length, 1);
});

test('set non-nested elements', t => {
  const { node } = t.context;
  node.innerHTML = '<div></div><div></div>';
  t.is(node.childNodes.length, 2);
});

test('set element with attributes', t => {
  const { node } = t.context;
  node.innerHTML = '<div hi="hello"></div>';
  const child = node.firstChild!;
  t.is(child.attributes.length, 1);
  t.is(child.attributes[0].name, 'hi');
  t.is(child.attributes[0].value, 'hello');
});

test('set self closing tags', t => {
  const { node } = t.context;
  node.innerHTML = '<br>';
  const child = node.firstChild!;
  t.is(child.nodeType, NodeType.ELEMENT_NODE);
  t.is(child.nodeName, 'BR');
});

test('set invalid html throws', t => {
  const { node } = t.context;
  // Use an unclosed tag.
  t.throws(() => (node.innerHTML = '<div>'));
});

test('set closes tags by closing others', t => {
  const { node } = t.context;
  node.innerHTML = '<div><a></div>';
  let child = node.firstChild!;
  t.is(child.nodeName, 'DIV');
  t.is(child.firstChild!.nodeName, 'A');

  node.innerHTML = '<p><div></div>';
  t.true(node.childNodes.length === 2);
  t.is(node.innerHTML, '<p></p><div></div>');
});

// Some tags will automatically close others. Set innerHTML should consider this behavior, yet
// it should not apply for the root element's tags:
// https://github.com/ampproject/worker-dom/issues/372
test("set will alter root element's contents, not the element itself", t => {
  const document = createTestingDocument();
  const pNode = document.createElement('p');

  pNode.innerHTML = 'Hello World!';
  t.is(pNode.textContent, 'Hello World!');
});

test('set takes all block text element content as text', t => {
  const { node } = t.context;
  node.innerHTML = '<style><div></div></style>';
  const child = node.firstChild!; // style node
  const childContent = child.firstChild!;
  t.is(childContent.nodeType, NodeType.TEXT_NODE);
});

test('set normalizes html namespace tag names', t => {
  const { node } = t.context;
  node.innerHTML = '<Div></Div>';
  const child = node.firstChild!;
  t.is(child.localName, 'div');
  t.is(child.nodeName, 'DIV');
});

test('set creates correct types of HTML elements', t => {
  const { node } = t.context;
  node.innerHTML = '<input>';
  const child = node.firstChild!;
  t.true(child instanceof HTMLInputElement);
});

test('set has svg tag live in SVG namespace', t => {
  const { node } = t.context;
  node.innerHTML = '<svg></svg>';
  const child = node.firstChild!;
  t.is(child.namespaceURI, SVG_NAMESPACE);
});

test("set keeps localName's case for tags in SVG namespace", t => {
  const { node } = t.context;
  node.innerHTML = '<svg><feImage></feImage></svg>';
  const svgWrapper = node.firstChild!;
  const child = svgWrapper.firstChild!;
  t.is(child.localName, 'feImage');
  t.is(child.namespaceURI, SVG_NAMESPACE);
});

test('set resets namespace', t => {
  const { node } = t.context;
  node.innerHTML = '<svg></svg><div></div>';
  const htmlChild = node.lastChild!;
  t.is(htmlChild.namespaceURI, HTML_NAMESPACE);
});

test('set handles foreignObject tags correctly', t => {
  const { node } = t.context;
  node.innerHTML = '<svg><foreignObject><div></div></foreignObject></svg>';
  const svgWrapper = node.firstChild!;

  // foreignObject tag lives in SVG namespace
  const foreignObjectNode = svgWrapper.firstChild!;
  t.is(foreignObjectNode.namespaceURI, SVG_NAMESPACE);

  // children of foreignObject live in HTML namespace
  const foreignObjectChild = foreignObjectNode.firstChild!;
  t.is(foreignObjectChild.namespaceURI, HTML_NAMESPACE);
});

test('set resets namespace after foreignObject end tag', t => {
  const { node } = t.context;
  node.innerHTML = '<svg><foreignObject></foreignObject><div></div></svg>';

  const svgWrapper = node.firstChild!;
  const foreignObjectSibling = svgWrapper.lastChild!; // div node
  t.is(foreignObjectSibling.namespaceURI, SVG_NAMESPACE);
});

test('set throws for unsupported namespaces', t => {
  const { node } = t.context;
  node.namespaceURI = 'http://www.w3.org/TR/2010/REC-MathML3-20101021/';
  t.throws(() => {
    // the value to set should not be relevant here.
    node.innerHTML = '<div></div>';
  });
});
