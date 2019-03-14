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
import { createDocument, Document } from '../../worker-thread/dom/Document';
import { LongTask } from '../../worker-thread/long-task';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';

const test = anyTest as TestInterface<{
  document: Document;
  longTask: LongTask;
}>;

test.beforeEach(t => {
  const document = createDocument();
  const longTask = new LongTask(document);

  t.context = {
    document,
    longTask,
  };
});

test.serial('execute a long task', t => {
  const { document, longTask } = t.context;

  let startResolver: Function;
  let endResolver: Function;
  const startPromise = new Promise(resolve => {
    startResolver = resolve;
  });
  const endPromise = new Promise(resolve => {
    endResolver = resolve;
  });

  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      for (const mutation of mutations) {
        if (mutation.type == MutationRecordType.LONG_TASK_START) {
          startResolver();
        }
        if (mutation.type == MutationRecordType.LONG_TASK_END) {
          endResolver();
        }
      }
    },
  );
  observer.observe(document);

  return longTask
    .execute(Promise.resolve(-1))
    .then((result: any) => {
      t.is(result, -1);
      return Promise.all([startPromise, endPromise]) as Promise<any>;
    })
    .then(() => {
      observer.disconnect();
    });
});

test.serial('execute a long task via wrapper', t => {
  const { document, longTask } = t.context;

  const callback = function() {
    return Promise.resolve(-1);
  };

  let startResolver: Function;
  let endResolver: Function;
  const startPromise = new Promise(resolve => {
    startResolver = resolve;
  });
  const endPromise = new Promise(resolve => {
    endResolver = resolve;
  });

  const observer = new document.defaultView.MutationObserver(
    (mutations: MutationRecord[]): void => {
      for (const mutation of mutations) {
        if (mutation.type == MutationRecordType.LONG_TASK_START) {
          startResolver();
        }
        if (mutation.type == MutationRecordType.LONG_TASK_END) {
          endResolver();
        }
      }
    },
  );
  observer.observe(document);

  return longTask
    .wrap(callback)()
    .then((result: any) => {
      t.is(result, -1);
      return Promise.all([startPromise, endPromise]) as Promise<any>;
    })
    .then(() => {
      observer.disconnect();
    });
});
