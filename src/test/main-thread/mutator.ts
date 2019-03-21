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
import { MutatorProcessor } from '../../main-thread/mutator';
// import { MutationRecordType } from '../../worker-thread/MutationRecord';
import { NodeContext } from '../../main-thread/nodes';
import { Strings } from '../../main-thread/strings';
// import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { WorkerContext } from '../../main-thread/worker';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { Phases } from '../../transfer/Phase';

const test = anyTest as TestInterface<{
  env: Env;
  baseElement: Element;
  strings: Strings;
  nodeContext: NodeContext;
  workerContext: WorkerContext;
}>;

test.beforeEach(t => {
  const env = new Env();

  const { document } = env;
  const baseElement = document.createElement('div');
  document.body.appendChild(baseElement);

  const strings = new Strings();
  const nodeContext = new NodeContext(strings, baseElement);

  const workerContext = ({
    getWorker() {},
    messageToWorker() {},
  } as unknown) as WorkerContext;

  t.context = {
    env,
    baseElement,
    strings,
    nodeContext,
    workerContext,
  };
});

test.afterEach(t => {
  const { env } = t.context;
  env.dispose();
});

test.serial('batch mutations', t => {
  const { env, baseElement, strings, nodeContext, workerContext } = t.context;
  const { rafTasks } = env;
  const mutator = new MutatorProcessor(strings, nodeContext, workerContext, {
    domURL: 'domURL',
    authorURL: 'authorURL',
  });

  mutator.mutate(
    new ArrayBuffer(0),
    ['hidden'],
    new Uint16Array([
      TransferrableMutationType.ATTRIBUTES,
      2, // Base Node
      0,
      0,
      0 + 1,
    ]),
  );
  mutator.mutate(
    new ArrayBuffer(0),
    ['data-one'],
    new Uint16Array([
      TransferrableMutationType.ATTRIBUTES,
      2, // Base Node
      1,
      0,
      1 + 1,
    ]),
  );

  t.is(baseElement.getAttribute('hidden'), null);
  t.is(baseElement.getAttribute('data-one'), null);
  t.is(rafTasks.length, 1);
  rafTasks[0]();
  t.is(baseElement.getAttribute('hidden'), 'hidden');
  t.is(baseElement.getAttribute('data-one'), 'data-one');

  mutator.mutate(
    new ArrayBuffer(0),
    ['data-two'],
    new Uint16Array([
      TransferrableMutationType.ATTRIBUTES,
      2, // Base Node
      2,
      0,
      2 + 1,
    ]),
  );

  t.is(baseElement.getAttribute('data-two'), null);
  t.is(rafTasks.length, 2);
  rafTasks[1]();
  t.is(baseElement.getAttribute('data-two'), 'data-two');
});

test.serial('batch mutations with custom pump', t => {
  const { env, baseElement, strings, nodeContext, workerContext } = t.context;
  const { rafTasks } = env;

  const tasks: Array<{ phase: Phases; flush: Function }> = [];
  const mutator = new MutatorProcessor(strings, nodeContext, workerContext, {
    domURL: 'domURL',
    authorURL: 'authorURL',
    mutationPump: (flush: Function, phase: Phases) => {
      tasks.push({ phase, flush });
    },
  });

  mutator.mutate(
    new ArrayBuffer(0),
    ['hidden'],
    new Uint16Array([
      TransferrableMutationType.ATTRIBUTES,
      2, // Base Node
      0,
      0,
      0 + 1,
    ]),
  );
  mutator.mutate(
    new ArrayBuffer(0),
    ['data-one'],
    new Uint16Array([
      TransferrableMutationType.ATTRIBUTES,
      2, // Base Node
      1,
      0,
      1 + 1,
    ]),
  );

  t.is(baseElement.getAttribute('hidden'), null);
  t.is(baseElement.getAttribute('data-one'), null);
  t.is(rafTasks.length, 0);
  t.is(tasks.length, 1);
  t.is(tasks[0].phase, Phases.Initializing);
  tasks[0].flush();
  t.is(baseElement.getAttribute('hidden'), 'hidden');
  t.is(baseElement.getAttribute('data-one'), 'data-one');

  mutator.mutate(
    new ArrayBuffer(0),
    ['data-two'],
    new Uint16Array([
      TransferrableMutationType.ATTRIBUTES,
      2, // Base Node
      2,
      0,
      2 + 1,
    ]),
  );

  t.is(baseElement.getAttribute('data-two'), null);
  t.is(rafTasks.length, 0);
  t.is(tasks.length, 2);
  tasks[1].flush();
  t.is(baseElement.getAttribute('data-two'), 'data-two');
});

test.serial('split strings from mutations', t => {
  const { env, baseElement, strings, nodeContext, workerContext } = t.context;
  const { rafTasks } = env;
  const mutator = new MutatorProcessor(strings, nodeContext, workerContext, {
    domURL: 'domURL',
    authorURL: 'authorURL',
  });

  mutator.mutate(new ArrayBuffer(0), ['hidden'], new Uint16Array([]));
  mutator.mutate(
    new ArrayBuffer(0),
    [],
    new Uint16Array([
      TransferrableMutationType.ATTRIBUTES,
      2, // Base Node
      0,
      0,
      0 + 1,
    ]),
  );

  t.is(baseElement.getAttribute('hidden'), null);
  t.is(rafTasks.length, 1);
  rafTasks[0]();
  t.is(baseElement.getAttribute('hidden'), 'hidden');
});
