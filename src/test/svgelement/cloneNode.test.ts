/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
import { createTestingDocument } from '../DocumentCreation';
import { Element } from '../../worker-thread/dom/Element';
import { SVGElement } from '../../worker-thread/dom/SVGElement';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { SVG_NAMESPACE } from '../../transfer/TransferrableNodes';

const test = anyTest as TestInterface<{
  parent: Element;
  svg: SVGElement;
  path: Element;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    parent: document.createElement('div'),
    svg: document.createElementNS(SVG_NAMESPACE, 'svg'),
    path: document.createElementNS(SVG_NAMESPACE, 'path'),
  };

  t.context.parent.appendChild(t.context.svg);
  document.body.appendChild(t.context.parent);
});

test('cloneNode should create a new node with the same type', t => {
  const { svg } = t.context;

  t.is(svg.cloneNode().namespaceURI, svg.namespaceURI);
});

test('cloneNode should create a new node with the same tagName', t => {
  const { svg } = t.context;

  t.is(svg.cloneNode().tagName, svg.tagName);
});

test('cloneNode should create a new node with a different index', t => {
  const { svg } = t.context;

  t.not(svg.cloneNode()[TransferrableKeys.index], svg[TransferrableKeys.index]);
});

test('cloneNode should create a new node with the same attribute', t => {
  const { svg } = t.context;
  svg.setAttribute('fancy', 'yes');

  t.is(svg.cloneNode().getAttribute('fancy'), 'yes');
});

test('cloneNode should create a new node with the same attributes', t => {
  const { svg } = t.context;
  svg.setAttribute('fancy', 'yes');
  svg.setAttribute('virtual', 'no');

  t.is(svg.cloneNode().getAttribute('fancy'), 'yes');
  t.is(svg.cloneNode().getAttribute('virtual'), 'no');
});

test('cloneNode should create a new node with the same attributes, but not preserve attributes across the instances', t => {
  const { svg } = t.context;
  svg.setAttribute('fancy', 'yes');
  const clone = svg.cloneNode();
  svg.setAttribute('fancy', 'no');

  t.is(clone.getAttribute('fancy'), 'yes');
  t.is(svg.getAttribute('fancy'), 'no');
});

test('cloneNode should create a new node without the same properties', t => {
  const { svg } = t.context;
  svg.value = 'property value';

  t.not(svg.cloneNode().value, 'property value');
});

test('cloneNode should create a new node without the same children when the deep flag is not set', t => {
  const { svg } = t.context;
  const clone = svg.cloneNode();

  t.is(clone.childNodes.length, 0);
});

test('cloneNode should create a new node with the same children when the deep flag is set', t => {
  const { svg, path } = t.context;
  svg.appendChild(path);
  const clone = svg.cloneNode(true);

  t.is(svg.childNodes.length, clone.childNodes.length);
  t.is(svg.childNodes[0].tagName, clone.childNodes[0].tagName);
});
