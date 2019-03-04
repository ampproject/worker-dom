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
import { HydrateableNode, NodeType, SVG_NAMESPACE } from '../../transfer/TransferrableNodes';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { getForTesting as get } from '../../worker-thread/strings';
import { createDocument, Document } from '../../worker-thread/dom/Document';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';

const RANDOM_TEXT_CONTENT = `TEXT_CONTENT-${Math.random()}`;
const DIV_ID = 'DIV_ID';
const DIV_CLASS = 'DIV_CLASS';

const test = anyTest as TestInterface<{
  document: Document;
  div: HTMLElement;
}>;

test.beforeEach(t => {
  const document = createDocument();
  const div = document.createElement('div');

  div.setAttribute('id', DIV_ID);
  div.setAttribute('class', DIV_CLASS);
  div.textContent = RANDOM_TEXT_CONTENT;

  t.context = {
    document,
    div: div as HTMLElement,
  };
});

test('Element should serialize to a TransferrableNode', t => {
  const serializedDiv = t.context.div.hydrate();
  t.is(serializedDiv[TransferrableKeys.nodeType], NodeType.ELEMENT_NODE);
  t.is(serializedDiv[TransferrableKeys.nodeName], get('div') as number);

  t.not(serializedDiv[TransferrableKeys.childNodes], undefined);
  t.is((serializedDiv[TransferrableKeys.childNodes] as Array<HydrateableNode>).length, 1);
  t.is((serializedDiv[TransferrableKeys.childNodes] as Array<HydrateableNode>)[0][TransferrableKeys.textContent], get(RANDOM_TEXT_CONTENT) as number);

  t.not(serializedDiv[TransferrableKeys.attributes], undefined);
  t.is((serializedDiv[TransferrableKeys.attributes] as Array<[number, number, number]>).length, 2);
  t.is((serializedDiv[TransferrableKeys.attributes] as Array<[number, number, number]>)[0][1], get('id') as number);
  t.is((serializedDiv[TransferrableKeys.attributes] as Array<[number, number, number]>)[0][2], get(DIV_ID) as number);
  t.is((serializedDiv[TransferrableKeys.attributes] as Array<[number, number, number]>)[1][1], get('class') as number);
  t.is((serializedDiv[TransferrableKeys.attributes] as Array<[number, number, number]>)[1][2], get(DIV_CLASS) as number);

  // Properties are not yet implemented
  // t.is(serializedDiv.properties.length, 0);
});

test('Element should serialize namespace', t => {
  const { document } = t.context;
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  t.is((svg.hydrate() as HydrateableNode)[TransferrableKeys.namespaceURI], get(SVG_NAMESPACE) as number);
});

test('Element should serialize child node as well', t => {
  const { document } = t.context;
  const div = document.createElement('div');
  const childDiv = document.createElement('div');
  div.appendChild(childDiv);

  const serializedDiv = div.hydrate() as HydrateableNode;
  const childNodes = serializedDiv[TransferrableKeys.childNodes] || [];
  t.is(childNodes.length, 1);
  t.deepEqual(childNodes[0], childDiv.hydrate());
});
