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
import { LongTaskProcessor } from '../../main-thread/commands/long-task';

const test = anyTest as TestInterface<{
  env: Env;
  processor: LongTaskProcessor;
  longTasks: Array<Promise<any>>;
}>;

test.beforeEach(t => {
  const env = new Env();

  const longTasks: Array<Promise<any>> = [];
  const processor = new LongTaskProcessor({
    onLongTask: (promise: Promise<any>) => {
      longTasks.push(promise);
    },
  });

  t.context = {
    env,
    processor,
    longTasks,
  };
});

test.afterEach(t => {
  const { env } = t.context;
  env.dispose();
});

test.serial('should tolerate no callback', t => {
  const { longTasks } = t.context;
  const processor = new LongTaskProcessor();

  processor.processStart();
  processor.processEnd();
  t.is(longTasks.length, 0);
});

test.serial('should create and release a long task', t => {
  const { processor, longTasks } = t.context;

  processor.processStart();
  t.is(longTasks.length, 1);
  t.true(processor.isInLongTask());

  // Ensure the promise is resolved in the end.
  processor.processEnd();
  t.is(longTasks.length, 1);
  t.false(processor.isInLongTask());
  return longTasks[0];
});

test.serial('should nest long tasks', t => {
  const { processor, longTasks } = t.context;

  processor.processStart();
  t.is(longTasks.length, 1);
  t.true(processor.isInLongTask());

  // Nested: no new promise/task created.
  processor.processStart();
  t.is(longTasks.length, 1);
  t.true(processor.isInLongTask());

  // Unnest: the task is still active.
  processor.processEnd();
  t.is(longTasks.length, 1);
  t.true(processor.isInLongTask());

  // Ensure the promise is resolved in the end.
  processor.processEnd();
  t.is(longTasks.length, 1);
  t.false(processor.isInLongTask());
  return longTasks[0];
});

test.serial('should restart a next long tasks', t => {
  const { processor, longTasks } = t.context;

  // Start 1st task.
  processor.processStart();
  t.is(longTasks.length, 1);
  t.true(processor.isInLongTask());

  // End 1st task.
  processor.processEnd();
  t.is(longTasks.length, 1);
  t.false(processor.isInLongTask());

  // Start 2nd task.
  processor.processStart();
  t.is(longTasks.length, 2);
  t.true(processor.isInLongTask());

  // End 2nd task.
  processor.processEnd();
  t.is(longTasks.length, 2);
  t.false(processor.isInLongTask());

  // All tasks must resolve.
  return Promise.all(longTasks) as Promise<any>;
});
