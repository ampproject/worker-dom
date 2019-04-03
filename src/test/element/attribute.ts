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
import { Attr } from '../../worker-thread/dom/Attr';
import { HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  attr: Attr;
  attrOverride: Attr;
  attrTwo: Attr;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    attr: { namespaceURI: HTML_NAMESPACE, name: 'name', value: 'value' } as Attr,
    attrOverride: { namespaceURI: HTML_NAMESPACE, name: 'name', value: 'value-overide' } as Attr,
    attrTwo: { namespaceURI: HTML_NAMESPACE, name: 'name-two', value: 'value-two' } as Attr,
  };
});

test('getAttribute returns null when the attribute does not exist', t => {
  const { node } = t.context;

  t.is(node.getAttribute('undefined'), null);
});

test('getAttribute returns value when the attribute does exist', t => {
  const { node, attr } = t.context;

  node.attributes.push(attr);
  t.is(node.getAttribute(attr.name), attr.value);
});

test('setAttribute creates a new attribute when one does not exist', t => {
  const { node, attr } = t.context;

  t.is(node.attributes.length, 0);
  node.setAttribute(attr.name, attr.value);
  t.is(node.attributes.length, 1);
  t.deepEqual(node.attributes[0], attr);
});

test('setAttribute overwrites the value if the attribute already exists', t => {
  const { node, attr, attrTwo, attrOverride } = t.context;

  node.setAttribute(attr.name, attr.value);
  node.setAttribute(attrTwo.name, attrTwo.value);
  node.setAttribute(attr.name, attrOverride.value);
  t.is(node.attributes.length, 2);
  t.deepEqual(node.attributes[0], attrOverride);
});

test('setAttribute converts non-strings to strings', t => {
  const { node } = t.context;

  node.setAttribute('foo', 123);
  t.is(node.getAttribute('foo'), '123');

  node.setAttribute('foo', false);
  t.is(node.getAttribute('foo'), 'false');

  node.setAttribute('foo', null);
  t.is(node.getAttribute('foo'), 'null');

  node.setAttribute('foo', undefined);
  t.is(node.getAttribute('foo'), 'undefined');

  node.setAttribute('foo', {});
  t.is(node.getAttribute('foo'), '[object Object]');

  node.setAttribute('foo', { toString: () => 'bar' });
  t.is(node.getAttribute('foo'), 'bar');
});

test('removeAttribute deletes a value from the attributes', t => {
  const { node, attr } = t.context;

  node.attributes.push(attr);
  node.removeAttribute(attr.name);
  t.is(node.attributes.length, 0);
});

test('removeAttribute deletes only a specific value from the attributes', t => {
  const { node, attr, attrTwo } = t.context;

  node.attributes.push(attr);
  node.attributes.push(attrTwo);
  node.removeAttribute(attr.name);
  t.is(node.attributes.length, 1);
  t.deepEqual(node.attributes[0], attrTwo);
});

test('hasAttribute returns false when the attribute is not present', t => {
  const { node } = t.context;

  t.is(node.hasAttribute('undefined'), false);
});

test('hasAttribute returns true when the attribute is present', t => {
  const { node } = t.context;

  node.setAttribute('defined', 'yeppers');
  t.is(node.hasAttribute('defined'), true);
});

test('hasAttributes return false when the Element does not have attributes', t => {
  const { node } = t.context;

  t.is(node.hasAttributes(), false);
});

test('hasAttributes return true when the Element has attributes in the null namespaceURI', t => {
  const { node } = t.context;

  node.setAttribute('defined', 'yeppers');
  t.is(node.hasAttributes(), true);
});

test('hasAttributes return true when the Element has attributes in other namespaceURIs', t => {
  const { node } = t.context;

  node.setAttributeNS('namespace', 'defined', 'yeppers');
  t.is(node.hasAttributes(), true);
});
