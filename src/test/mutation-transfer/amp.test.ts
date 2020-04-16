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
import { AMP } from '../../worker-thread/amp/amp';
import { Document } from '../../worker-thread/dom/Document';
import { GetOrSet } from '../../transfer/Messages';
import { StorageLocation } from '../../transfer/TransferrableStorage';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { createTestingDocument } from '../DocumentCreation';
import { expectMutations } from '../Emitter';
import { getForTesting } from '../../worker-thread/strings';

const test = anyTest as TestInterface<{
  document: Document;
  amp: AMP;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const amp = new AMP(document);

  t.context = {
    document,
    amp,
  };
});

test.serial.cb('AMP.getState()', (t) => {
  const { document, amp } = t.context;

  let addGlobalEventListenerCalled = false;
  document.addGlobalEventListener = () => {
    addGlobalEventListenerCalled = true;
  };

  expectMutations(document, (mutations) => {
    t.true(addGlobalEventListenerCalled);
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.GET, StorageLocation.AmpState, getForTesting('foo'), 0]);
    t.end();
  });

  amp.getState('foo');
});

test.serial.cb('AMP.setState()', (t) => {
  const { document, amp } = t.context;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.AmpState, 0, getForTesting('{"foo":"bar"}')]);
    t.end();
  });

  amp.setState({ foo: 'bar' });
});
