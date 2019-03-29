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
import { install } from '../../main-thread/install';

const test = anyTest as TestInterface<{
  env: Env;
  baseElement: HTMLElement;
}>;

test.beforeEach(t => {
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');
  document.body.appendChild(baseElement);

  t.context = {
    env,
    baseElement,
  };
});

test.afterEach(t => {
  t.context.env.dispose();
});

test.serial('terminate the worker-dom', t => {
  const { env, baseElement } = t.context;

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  return install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
  }).then((workerDOM: Worker) => {
    t.is(env.workers.length, 1);
    const worker = env.workers[0];
    t.is(worker.terminated, false);
    workerDOM.terminate();
    t.is(worker.terminated, true);
  });
});
