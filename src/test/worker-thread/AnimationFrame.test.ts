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

const test = anyTest as TestInterface<{ runTimeout: Function; runAllTimeouts: Function }>;
const originalSetTimeout = globalThis.setTimeout;

test.beforeEach((t) => {
  const timeouts: Array<Function> = [];
  globalThis.setTimeout = ((cb: any) => timeouts.push(cb)) as any;

  function runTimeout() {
    let cb = timeouts.shift();
    if (cb) {
      cb();
    }
  }

  function runAllTimeouts() {
    while (timeouts.length) {
      runTimeout();
    }
  }

  t.context = { runTimeout, runAllTimeouts };
});

test.afterEach((t) => {
  t.context.runAllTimeouts();
  globalThis.setTimeout = originalSetTimeout;
});

test.serial('rafPolyfill should return a number', (t) => {
  t.assert(Number.isInteger(rafPolyfill(() => {})), 'should return a number');
});

test.serial('rafPolyfill executes the body of the supplied callback', (t) => {
  rafPolyfill(() => t.pass());
  t.context.runTimeout();
});

test.serial('rafPolyfill executes all callbacks, even if some throw', async (t) => {
  let raf2Executed = false;
  rafPolyfill(() => {
    throw new Error();
  });
  rafPolyfill(() => (raf2Executed = true));

  try {
    t.context.runAllTimeouts();
  } catch (err) {}

  t.true(raf2Executed);
});

test.serial('all the accumulated callbacks are called in the same frame', async (t) => {
  let raf1Executed = false;
  let raf2Executed = false;
  rafPolyfill(() => (raf1Executed = true));
  rafPolyfill(() => (raf2Executed = true));

  t.context.runTimeout();
  t.true(raf1Executed && raf2Executed);
});

test.serial('raf within a raf gets scheduled for the next batch', async (t) => {
  let raf1Executed = false;
  let raf2Executed = false;

  rafPolyfill(() => {
    raf1Executed = true;
    rafPolyfill(() => (raf2Executed = true));
  });

  t.context.runTimeout();
  t.true(raf1Executed);
  t.false(raf2Executed);

  t.context.runTimeout();
  t.true(raf1Executed && raf2Executed);
});

test.serial('cafPolyfill can cancel execution of a callback', (t) => {
  let executed = false;
  let raf1handle = rafPolyfill(() => (executed = true));
  rafPolyfill(() => {});
  cafPolyfill(raf1handle);

  t.context.runAllTimeouts();
  t.false(executed, 'raf1 should not have executed');
});
