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
import { NodeContext } from '../../main-thread/nodes';
import { StringContext } from '../../main-thread/strings';
import { WorkerContext } from '../../main-thread/worker';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { Phase } from '../../transfer/Phase';
import { normalizeConfiguration } from '../../main-thread/configuration';
import { ObjectContext } from '../../main-thread/object-context';

const test = anyTest as TestInterface<{
  env: Env;
  baseElement: Element;
  stringContext: StringContext;
  nodeContext: NodeContext;
  workerContext: WorkerContext;
  objectContext: ObjectContext;
}>;

test.beforeEach(t => {
  const env = new Env();

  const { document } = env;
  const baseElement = document.createElement('div');
  document.body.appendChild(baseElement);

  const stringContext = new StringContext();
  const objectContext = new ObjectContext();
  const nodeContext = new NodeContext(stringContext, baseElement);

  const workerContext = ({
    getWorker() {},
    messageToWorker() {},
  } as unknown) as WorkerContext;

  t.context = {
    env,
    baseElement,
    stringContext,
    nodeContext,
    workerContext,
    objectContext,
  };
});

test.afterEach(t => {
  const { env } = t.context;
  env.dispose();
});

test.serial('batch mutations', t => {
  const { env, baseElement, stringContext, nodeContext, workerContext, objectContext } = t.context;
  const { rafTasks } = env;
  const mutator = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
    }),
    objectContext,
  );

  mutator.mutate(
    Phase.Mutating,
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
    Phase.Mutating,
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
    Phase.Mutating,
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
  const { env, baseElement, stringContext, nodeContext, workerContext, objectContext } = t.context;
  const { rafTasks } = env;

  const tasks: Array<{ phase: Phase; flush: Function }> = [];
  const mutator = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
      mutationPump: (flush: Function, phase: Phase) => {
        tasks.push({ phase, flush });
      },
    }),
    objectContext,
  );

  mutator.mutate(
    Phase.Mutating,
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
    Phase.Mutating,
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
  t.is(tasks[0].phase, Phase.Mutating);
  tasks[0].flush();
  t.is(baseElement.getAttribute('hidden'), 'hidden');
  t.is(baseElement.getAttribute('data-one'), 'data-one');

  mutator.mutate(
    Phase.Mutating,
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

test.serial('leverage allowlist to exclude mutation type', t => {
  const { env, baseElement, stringContext, nodeContext, workerContext, objectContext } = t.context;
  const { rafTasks } = env;
  const mutator = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
      executorsAllowed: [TransferrableMutationType.CHILD_LIST],
    }),
    objectContext,
  );

  mutator.mutate(
    Phase.Mutating,
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
    Phase.Mutating,
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
  t.is(baseElement.getAttribute('hidden'), null);
  t.is(baseElement.getAttribute('data-one'), null);
});

test.serial('split strings from mutations', t => {
  const { env, baseElement, stringContext, nodeContext, workerContext, objectContext } = t.context;
  const { rafTasks } = env;
  const mutator = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
    }),
    objectContext,
  );

  mutator.mutate(Phase.Mutating, new ArrayBuffer(0), ['hidden'], new Uint16Array([]));
  mutator.mutate(
    Phase.Mutating,
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
