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

test.beforeEach(t => {
  t.context = {
    node: new Element(NodeType.ELEMENT_NODE, 'div', null),
    callback: () => undefined,
    callbackTwo: () => false,
  };
});

test('event handlers are undefined by default', t => {
  const { node } = t.context;

  t.is(node._handlers_['click'], undefined);
});

test('adding an event listener increases total registered events from 0 to 1 on a Node', t => {
  const { node, callback } = t.context;

  node.addEventListener('click', callback);
  t.is(node._handlers_['click'].length, 1);
  t.is(node._handlers_['click'][0], callback);
});

test('adding a second event listener increases total registered events from 0 to 2 on a Node', t => {
  const { node, callback, callbackTwo } = t.context;

  node.addEventListener('click', callback);
  t.is(node._handlers_['click'].length, 1);
  t.is(node._handlers_['click'][0], callback);
  t.is(node._handlers_['click'][1], undefined);

  node.addEventListener('click', callbackTwo);
  t.is(node._handlers_['click'].length, 2);
  t.is(node._handlers_['click'][0], callback);
  t.is(node._handlers_['click'][1], callbackTwo);
});
