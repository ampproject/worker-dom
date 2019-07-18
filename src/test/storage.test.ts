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
import { createTestingDocument } from './DocumentCreation';
import { Storage, createStorage } from '../worker-thread/Storage';
import { StorageLocation } from '../transfer/TransferrableStorage';

const test = anyTest as TestInterface<{
  storage: Storage;
}>;

test.beforeEach(t => {
  const document = createTestingDocument();
  t.context = {
    storage: createStorage(document, StorageLocation.Local, { existingKey: 'existingValue' }),
  };
});

test('can access existing data', t => {
  const { storage } = t.context;
  t.is(storage.getItem('existingKey'), 'existingValue');
});

test('cannot access Object.prototype keys', t => {
  const { storage } = t.context;
  t.is(storage.getItem('constructor'), null);
  t.is(storage.getItem('toString'), null);
});

test('can access data with bracket notation', t => {
  const { storage } = t.context;
  const s = storage as any;
  t.is(s['existingKey'], 'existingValue');

  storage.setItem('foo', 'bar');
  t.is(s['foo'], 'bar');

  s['bar'] = 'foo';
  t.is(storage.getItem('bar'), 'foo');
});

test('can be JSON-stringified', t => {
  const { storage } = t.context;
  t.is(JSON.stringify(storage), '{"existingKey":"existingValue"}');

  storage.setItem('foo', 'bar');
  t.is(JSON.stringify(storage), '{"existingKey":"existingValue","foo":"bar"}');
});

test('length', t => {
  const { storage } = t.context;
  t.is(storage.length, 1);

  storage.setItem('foo', 'bar');
  t.is(storage.length, 2);
});

test('key()', t => {
  const { storage } = t.context;
  t.is(storage.key(0), 'existingKey');

  storage.setItem('foo', 'bar');
  t.is(storage.key(1), 'foo');

  t.is(storage.key(-1), null);
  t.is(storage.key(2), null);
});

test('getItem() and setItem()', t => {
  const { storage } = t.context;
  storage.setItem('foo', 'bar');
  t.is(storage.getItem('foo'), 'bar');

  storage.setItem('foo', 'overwrite');
  t.is(storage.getItem('foo'), 'overwrite');

  t.is(storage.getItem('doesNotExist'), null);
});

test('modifying a readonly property', t => {
  const { storage } = t.context;
  t.throws(() => storage.setItem('setItem', 'shouldThrow'));
  t.throws(() => storage.removeItem('removeItem'));
});

test('removeItem()', t => {
  const { storage } = t.context;

  storage.removeItem('existingKey');
  t.is(storage.getItem('existingKey'), null);
});

test('clear()', t => {
  const { storage } = t.context;
  storage.clear();
  t.is(storage.length, 0);
  t.is(storage.getItem('existingKey'), null);
});
