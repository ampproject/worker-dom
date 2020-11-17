/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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
import { initialize, WorkerStorageInit } from '../../worker-thread/initialize';
import { Document } from '../../worker-thread/dom/Document';
import { HydrateableNode } from '../../transfer/TransferrableNodes';

const test = anyTest as TestInterface<{
  doc: Document;
  self: any;
}>;
test.beforeEach((t) => {
  const doc = { defaultView: {} } as Document;
  const self: any = {};
  (globalThis as any).self = self;
  t.context = { doc, self };
});

test.serial('Should install throwing storage', (t) => {
  const unsupportedAccess: WorkerStorageInit = {
    supported: false,
    errorMsg: 'Access denied',
  };
  const { doc, self } = t.context;
  initialize(doc, [], {} as HydrateableNode, [], [], [0, 0], unsupportedAccess, unsupportedAccess);
  t.throws(() => doc.defaultView.localStorage, {
    message: unsupportedAccess.errorMsg,
  });
  t.throws(() => self.localStorage, { message: unsupportedAccess.errorMsg });
  t.throws(() => doc.defaultView.sessionStorage, {
    message: unsupportedAccess.errorMsg,
  });
  t.throws(() => self.sessionStorage, { message: unsupportedAccess.errorMsg });
});

test.serial('Should install accessible storage', (t) => {
  const supportedAccess: WorkerStorageInit = {
    supported: true,
    storage: {},
  };
  const { doc } = t.context;
  initialize(doc, [], {} as HydrateableNode, [], [], [0, 0], supportedAccess, supportedAccess);
  try {
    doc.defaultView.localStorage;
    doc.defaultView.sessionStorage;
    t.pass('Accessing storage did not throw.');
  } catch (err) {
    t.fail(err);
  }
});
