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
import { Env } from './helpers/env';
import { LongTaskCommandExecutor, LongTaskExecutor } from '../../main-thread/commands/long-task';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

const test = anyTest as TestInterface<{
  env: Env;
  executor: LongTaskCommandExecutor;
  longTasks: Array<Promise<any>>;
  baseElement: HTMLElement;
}>;

test.beforeEach(t => {
  const env = new Env();
  const { document } = env;
  const longTasks: Array<Promise<any>> = [];
  const executor = LongTaskExecutor({
    authorURL: 'authorURL',
    domURL: 'domURL',
    longTask: (promise: Promise<any>) => {
      longTasks.push(promise);
    },
  });

  const baseElement = document.createElement('div');
  baseElement._index_ = 1;
  document.body.appendChild(baseElement);

  t.context = {
    env,
    executor,
    longTasks,
    baseElement,
  };
});

test.afterEach(t => {
  const { env } = t.context;
  env.dispose();
});

test.serial('should tolerate no callback', t => {
  const { longTasks, baseElement } = t.context;
  const executor = LongTaskExecutor({
    authorURL: 'authorURL',
    domURL: 'domURL',
  });

  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, baseElement);
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 0);
});

test.serial('should create and release a long task', t => {
  const { executor, longTasks, baseElement } = t.context;

  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // Ensure the promise is resolved in the end.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 1);
  t.false(executor.active);
  return longTasks[0];
});

test.serial('should nest long tasks', t => {
  const { executor, longTasks, baseElement } = t.context;

  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // Nested: no new promise/task created.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // Unnest: the task is still active.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // Ensure the promise is resolved in the end.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 1);
  t.false(executor.active);
  return longTasks[0];
});

test.serial('should restart a next long tasks', t => {
  const { executor, longTasks, baseElement } = t.context;

  // Start 1st task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // End 1st task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 1);
  t.false(executor.active);

  // Start 2nd task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 2);
  t.true(executor.active);

  // End 2nd task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, baseElement);
  t.is(longTasks.length, 2);
  t.false(executor.active);

  // All tasks must resolve.
  return Promise.all(longTasks) as Promise<any>;
});
