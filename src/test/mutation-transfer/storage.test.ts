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
import { Document } from '../../worker-thread/dom/Document';
import { GetOrSet } from '../../transfer/Messages';
import { Storage, createStorage } from '../../worker-thread/Storage';
import { StorageLocation } from '../../transfer/TransferrableStorage';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { createTestingDocument } from '../DocumentCreation';
import { expectMutations } from '../Emitter';
import { getForTesting } from '../../worker-thread/strings';
import { setTimeout } from 'timers';

const test = anyTest as TestInterface<{
  document: Document;
  storage: Storage;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const storage = createStorage(document, StorageLocation.Local, {});

  t.context = {
    document,
    storage,
  };
});

test.serial.cb('Storage.getItem', (t) => {
  const { document, storage } = t.context;

  let postMessageCalled = false;
  document.postMessage = () => (postMessageCalled = true);

  storage.getItem('foo');

  // getItem() should return local data, not invoke postMessage.
  setTimeout(() => {
    t.false(postMessageCalled);
    t.end();
  }, 0);
});

test.serial.cb('Storage.setItem', (t) => {
  const { document, storage } = t.context;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.Local, getForTesting('foo'), getForTesting('bar')]);
    t.end();
  });

  storage.setItem('foo', 'bar');
});

test.serial.cb('Storage.removeItem', (t) => {
  const { document, storage } = t.context;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.Local, getForTesting('foo'), 0]);
    t.end();
  });

  storage.removeItem('foo');
});

test.serial.cb('Storage.clear', (t) => {
  const { document, storage } = t.context;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.Local, 0, 0]);
    t.end();
  });

  storage.clear();
});
