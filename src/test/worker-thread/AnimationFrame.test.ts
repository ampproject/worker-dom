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
import { rafPolyfill, cafPolyfill } from '../../worker-thread/AnimationFrame';

const noop = () => {};

const test = anyTest as TestInterface<{}>;

test.beforeEach((t) => {
  // Object.defineProperty(globalThis, 'performance',{ value: {now: () => Date.now()}});
});

test('rafPolyfill should return a number', (t) => {
  t.assert(Number.isInteger(rafPolyfill(noop)), 'should return a number');
});

test('rafPolyfill executes the body of the supplied callback', (t) => {
  let resolve: Function;
  const rafExecuted: Promise<any> = new Promise((res) => (resolve = res));
  rafPolyfill(() => {
    resolve();
    t.pass();
  });

  return rafExecuted;
});

test.only('rafPolyfill will execute all callbacks, even if some throw', (t) => {
  let rafSuccessResolve: Function;
  let rafErrorResolve: Function;
  const rafExecuted = new Promise((res) => (rafSuccessResolve = res));
  const errorPromise = new Promise((res) => (rafErrorResolve = res));
  rafPolyfill(() => {
    throw new Error('raf1');
  });
  rafPolyfill(() => rafSuccessResolve());

  process.on('uncaughtException', (err) => {
    if (err.message === 'raf1') {
      rafErrorResolve();
    }
  });

  return Promise.all([rafExecuted, errorPromise]).then(() => t.pass());
});

test('cafPolyfill can cancel execution via the handler', (t) => {
  let resolve: Function;
  let executed = false;
  let raf1handle = rafPolyfill(() => (executed = true));
  const raf2Promise = new Promise((res) => (resolve = res));
  rafPolyfill(() => resolve());
  cafPolyfill(raf1handle);

  return raf2Promise.then(() => t.assert(!executed));
});
