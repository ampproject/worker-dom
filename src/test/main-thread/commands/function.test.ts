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
import { registerPromise, FunctionProcessor } from '../../../main-thread/commands/function';
import { StringContext } from '../../../main-thread/strings';
import { WorkerDOMConfiguration } from '../../../main-thread/configuration';
import { CommandExecutor } from '../../../main-thread/commands/interface';
import { TransferrableMutationType, FunctionMutationIndex } from '../../../transfer/TransferrableMutation';
import { ResolveOrReject } from '../../../transfer/Messages';

const test = anyTest as TestInterface<{}>;

function getFunctionProcessor(strings: string[]): CommandExecutor {
  const stringCtx = new StringContext();
  stringCtx.storeValues(strings);

  return FunctionProcessor(
    stringCtx,
    undefined as any,
    undefined as any,
    undefined as any,
    {
      executorsAllowed: [TransferrableMutationType.FUNCTION_CALL],
    } as WorkerDOMConfiguration,
  );
}

test('Returns the value of a resolved function', async (t) => {
  const { promise, index } = registerPromise();
  const processor = getFunctionProcessor([JSON.stringify({ val: true })]);
  const mutations: number[] = [];
  mutations[FunctionMutationIndex.Status] = ResolveOrReject.RESOLVE;
  mutations[FunctionMutationIndex.Index] = index;
  mutations[FunctionMutationIndex.Value] = 0;

  processor.execute(new Uint16Array(mutations), 0, true);
  t.deepEqual(await promise, { val: true });
});

test('Is able to return undefined', async (t) => {
  const { promise, index } = registerPromise();
  const processor = getFunctionProcessor([JSON.stringify(undefined)]);
  const mutations: number[] = [];
  mutations[FunctionMutationIndex.Status] = ResolveOrReject.RESOLVE;
  mutations[FunctionMutationIndex.Index] = index;
  mutations[FunctionMutationIndex.Value] = 0;

  processor.execute(new Uint16Array(mutations), 0, true);
  t.deepEqual(await promise, undefined);
});

test('Returns the value of a rejected value', (t) => {
  const { promise, index } = registerPromise();
  const processor = getFunctionProcessor([JSON.stringify(`error message`)]);
  const mutations: number[] = [];
  mutations[FunctionMutationIndex.Status] = ResolveOrReject.REJECT;
  mutations[FunctionMutationIndex.Index] = index;
  mutations[FunctionMutationIndex.Value] = 0;

  processor.execute(new Uint16Array(mutations), 0, true);
  return promise.then(
    () => {
      t.fail();
    },
    (error) => {
      t.deepEqual(error, `error message`);
    },
  );
});
