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

import test from 'ava';
import { NodeType } from '../../worker-thread/dom/Node';
import { Element } from '../../worker-thread/dom/Element';
import { Attr } from '../../worker-thread/dom/Attr';

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', null),
    attr: { namespaceURI: null, name: 'name', value: 'value' } as Attr,
    attrOveride: { namespaceURI: null, name: 'name', value: 'value-overide' } as Attr,
    attrTwo: { namespaceURI: null, name: 'name-two', value: 'value-two' } as Attr,
  };
});

test('getAttribute returns null when the attribute does not exist', t => {
  const { node } = t.context as { node: Element };

  t.is(node.getAttribute('undefined'), null);
});

test('getAttribute returns value when the attribute does exist', t => {
  const { node, attr } = t.context as { node: Element; attr: Attr };

  node.attributes.push(attr);
  t.is(node.getAttribute(attr.name), attr.value);
});

test('setAttribute creates a new attribute when one does not exist', t => {
  const { node, attr } = t.context as { node: Element; attr: Attr };

  t.is(node.attributes.length, 0);
  node.setAttribute(attr.name, attr.value);
  t.is(node.attributes.length, 1);
  t.deepEqual(node.attributes[0], attr);
});

test('setAttribute overwrites the value if the attribute already exists', t => {
  const { node, attr, attrTwo, attrOveride } = t.context as { node: Element; attr: Attr; attrTwo: Attr; attrOveride: Attr };

  node.setAttribute(attr.name, attr.value);
  node.setAttribute(attrTwo.name, attrTwo.value);
  node.setAttribute(attr.name, attrOveride.value);
  t.is(node.attributes.length, 2);
  t.deepEqual(node.attributes[0], attrOveride);
});

test('removeAttribute deletes a value from the attributes', t => {
  const { node, attr } = t.context as { node: Element; attr: Attr };

  node.attributes.push(attr);
  node.removeAttribute(attr.name);
  t.is(node.attributes.length, 0);
});

test('removeAttribute deletes only a specific value from the attributes', t => {
  const { node, attr, attrTwo } = t.context as { node: Element; attr: Attr; attrTwo: Attr };

  node.attributes.push(attr);
  node.attributes.push(attrTwo);
  node.removeAttribute(attr.name);
  t.is(node.attributes.length, 1);
  t.deepEqual(node.attributes[0], attrTwo);
});

test('hasAttribute returns false when the attribute is not present', t => {
  const { node } = t.context as { node: Element };

  t.is(node.hasAttribute('undefined'), false);
});

test('hasAttribute returns true when the attribute is present', t => {
  const { node } = t.context as { node: Element };

  node.setAttribute('defined', 'yeppers');
  t.is(node.hasAttribute('defined'), true);
});

test('hasAttributes return false when the Element does not have attributes', t => {
  const { node } = t.context as { node: Element };

  t.is(node.hasAttributes(), false);
});

test('hasAttributes return true when the Element has attributes in the null namespaceURI', t => {
  const { node } = t.context as { node: Element };

  node.setAttribute('defined', 'yeppers');
  t.is(node.hasAttributes(), true);
});

test('hasAttributes return true when the Element has attributes in other namespaceURIs', t => {
  const { node } = t.context as { node: Element };

  node.setAttributeNS('namespace', 'defined', 'yeppers');
  t.is(node.hasAttributes(), true);
});
