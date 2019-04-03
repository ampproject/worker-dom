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
import { Event } from '../../worker-thread/Event';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  event: Event;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();
  const node = document.createElement('div');
  const event = new Event('click', {});
  event.target = node;

  t.context = {
    node,
    event,
  };
});

test('calls handler functions registered with addEventListener', t => {
  const { node, event } = t.context;

  node.addEventListener('click', (event: Event) => {
    t.deepEqual(event.target, node, 'event target is the node the event was dispatched from');
    t.pass();
  });
  t.true(node.dispatchEvent(event));
});

test('does not call handler functions removed with removeEventListener', t => {
  const { node, event } = t.context;
  const functionRemoved = (event: Event) => t.fail('removeEventListener function handler was called');

  node.addEventListener('click', functionRemoved);
  node.removeEventListener('click', functionRemoved);
  t.true(node.dispatchEvent(event));
});

test('calls handler functions for only specified type of event', t => {
  const { node, event } = t.context;

  node.addEventListener('click', (event: Event) => {
    t.is(event.type, 'click', 'event type is correct');
  });
  node.addEventListener('foo', (event: Event) => {
    t.fail('handler for the incorrect type was called');
  });
  t.true(node.dispatchEvent(event));
});
