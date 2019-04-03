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
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  callback: () => undefined;
  callbackTwo: () => false;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    callback: () => undefined,
    callbackTwo: () => false,
  };
});

test('removing the only registered callback retains array with zero length', t => {
  const { node, callback } = t.context;

  node.addEventListener('click', callback);
  node.removeEventListener('click', callback);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], []);
});

test('removing a specific callback from list with more than one callback reduces the list to the remaining callback', t => {
  const { node, callback, callbackTwo } = t.context;

  node.addEventListener('click', callback);
  node.addEventListener('click', callbackTwo);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], [callback, callbackTwo]);
  node.removeEventListener('click', callback);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], [callbackTwo]);
});

test('removing an unknown callback when callbacks are registerd to a type does nothing', t => {
  const { node, callback, callbackTwo } = t.context;

  node.addEventListener('click', callback);
  node.addEventListener('click', callbackTwo);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], [callback, callbackTwo]);
  node.removeEventListener('click', () => undefined);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], [callback, callbackTwo]);
});

test('removing an unknown callback for a unknown type does nothing', t => {
  const { node } = t.context;

  node.removeEventListener('click', () => undefined);
  t.is(node[TransferrableKeys.handlers]['click'], undefined);
});
