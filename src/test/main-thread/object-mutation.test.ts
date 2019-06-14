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
import * as sinon from 'sinon';
import { Strings } from '../../main-thread/strings';
import { ObjectContext } from '../../main-thread/object-context';
import { CommandExecutor } from '../../main-thread/commands/interface';
import { Env } from './helpers/env';
import { ObjectMutationProcessor } from '../../main-thread/commands/object-mutation';
import { NodeContext } from '../../main-thread/nodes';
import { WorkerContext } from '../../main-thread/worker';
import { normalizeConfiguration } from '../../main-thread/configuration';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { TransferrableArgs } from '../../transfer/TransferrableArgs';

const test = anyTest as TestInterface<{
  sandbox: sinon.SinonSandbox;
  strings: Strings;
  objectContext: ObjectContext;
  objectMutationProcessor: CommandExecutor;
  canvasElement: HTMLCanvasElement;
}>;

test.beforeEach(t => {
  const sandbox = sinon.createSandbox();
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');

  const strings = new Strings();
  const objectContext = new ObjectContext();

  const ctx = {} as CanvasRenderingContext2D;
  const canvasElement = ({ _index_: 1, getContext: (c: string) => ctx } as unknown) as HTMLCanvasElement;

  const nodeContext = new NodeContext(strings, baseElement);
  sandbox.stub(nodeContext, 'getNode').returns(canvasElement);
  const workerContext = ({
    getWorker() {},
    messageToWorker() {},
  } as unknown) as WorkerContext;

  const objectMutationProcessor = ObjectMutationProcessor(
    strings,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
    }),
    objectContext,
  );

  t.context = {
    sandbox,
    strings,
    objectContext,
    objectMutationProcessor,
    canvasElement,
  };
});

test.afterEach(t => {
  const { sandbox } = t.context;
  sandbox.restore();
});

test('Method call with no arguments', t => {
  const { sandbox, strings, objectMutationProcessor, canvasElement } = t.context;

  const methodName = 'stroke';
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(
    objectMutationProcessor,
    canvasElement,
    [TransferrableArgs.CanvasRenderingContext2D, canvasElement._index_],
    methodName,
    strings,
    0,
    [],
  );
  t.true(stub.withArgs().calledOnce);
});

test('Method with arguments', t => {
  const { strings, objectMutationProcessor, sandbox, canvasElement } = t.context;

  const methodName = 'fillRect';
  const serializedArgs = [TransferrableArgs.SmallInt, 1, TransferrableArgs.SmallInt, 2, TransferrableArgs.SmallInt, 3, TransferrableArgs.SmallInt, 4];
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(
    objectMutationProcessor,
    canvasElement,
    [TransferrableArgs.CanvasRenderingContext2D, canvasElement._index_],
    methodName,
    strings,
    4,
    serializedArgs,
  );
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('Setter', t => {
  const { strings, objectMutationProcessor, sandbox, canvasElement } = t.context;

  const methodName = 'lineWidth';
  const setter = sandbox.spy();
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  // must declare property before sinon lets us stub setter
  (targetObject[methodName] as any) = 'existent';
  sandbox.stub(targetObject, methodName).set(setter);

  const serializedArg = [TransferrableArgs.SmallInt, 5];

  executeCall(
    objectMutationProcessor,
    canvasElement,
    [TransferrableArgs.CanvasRenderingContext2D, canvasElement._index_],
    methodName,
    strings,
    1,
    serializedArg,
  );
  t.true(setter.withArgs(5).calledOnce);
});

test('Mutation starts at a non-zero offset', t => {
  const { strings, objectMutationProcessor, sandbox, canvasElement } = t.context;

  const methodName = 'fillRect';

  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  const args = [1, 2, 3, 4];
  const serializedArgs = [TransferrableArgs.SmallInt, 1, TransferrableArgs.SmallInt, 2, TransferrableArgs.SmallInt, 3, TransferrableArgs.SmallInt, 4];

  const mutation = [
    TransferrableMutationType.OBJECT_MUTATION,
    storeString(strings, methodName),
    4, // arg count
    TransferrableArgs.CanvasRenderingContext2D,
    canvasElement._index_,
    ...serializedArgs,
  ];

  // add three values to the start of the mutation and change the offset
  const mutationsArray = new Uint16Array([1, 2, 3].concat(mutation));
  objectMutationProcessor.execute(mutationsArray, 3, canvasElement);

  t.true(stub.withArgs(...args).calledOnce);
});

test('Returns correct end offset', t => {
  const { strings, objectMutationProcessor, canvasElement, sandbox } = t.context;

  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const methodName = 'fillRect';
  (targetObject[methodName] as sinon.SinonStub) = sandbox.stub();
  const serializedArgs = [TransferrableArgs.SmallInt, 1, TransferrableArgs.SmallInt, 2, TransferrableArgs.SmallInt, 3, TransferrableArgs.SmallInt, 4];

  const mutation = [
    TransferrableMutationType.OBJECT_MUTATION,
    storeString(strings, methodName),
    4, // arg count
    TransferrableArgs.CanvasRenderingContext2D,
    canvasElement._index_,
    ...serializedArgs,

    // add an extra value after the OBJECT_MUTATION, which should be at end offset after processing
    32,
  ];

  const mutationsArray = new Uint16Array([1, 2, 3].concat(mutation));
  const endOffset = objectMutationProcessor.execute(mutationsArray, 3, canvasElement);

  t.is(mutationsArray[endOffset], 32);
});

function executeCall(
  mutationProcessor: CommandExecutor,
  target: RenderableElement,
  serializedTargetObject: number[],
  fnName: string,
  strings: Strings,
  argCount: number,
  serializedArgs: number[],
  stringsIndex?: number,
) {
  return mutationProcessor.execute(
    new Uint16Array([
      TransferrableMutationType.OBJECT_MUTATION,
      storeString(strings, fnName, stringsIndex),
      argCount,
      ...serializedTargetObject,
      ...serializedArgs,
    ]),
    0,
    target,
  );
}

// main-thread's strings API does not return an ID when storing a string
// so for convenience:
function storeString(strings: Strings, text: string, currentIndex = -1) {
  strings.store(text);
  return ++currentIndex;
}
