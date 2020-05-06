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
import { exportFunction, callFunctionMessageHandler, resetForTesting } from '../../worker-thread/function';
import { createTestingDocument } from '../DocumentCreation';
import { emitter, Emitter } from '../Emitter';
import { MutationFromWorker, ResolveOrReject, MessageType } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { Document } from '../../worker-thread/dom/Document';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

// import * as sinon from 'sinon';

const noop = () => {};

const test = anyTest as TestInterface<{
  document: Document;
  emitter: Emitter;
}>;

test.beforeEach((t) => {
  resetForTesting();
  const document = createTestingDocument();

  t.context = {
    document,
    emitter: emitter(document),
  };
});

const index = 1;
function getFunctionEvent(fnName: string, args: any): MessageEvent {
  return {
    data: {
      [TransferrableKeys.type]: MessageType.FUNCTION,
      [TransferrableKeys.functionIdentifier]: fnName,
      [TransferrableKeys.functionArguments]: JSON.stringify(args),
      [TransferrableKeys.index]: index,
    },
  } as any;
}
function getFunctionMutation(status: ResolveOrReject, valIndex: number): Array<any> {
  return [TransferrableMutationType.FUNCTION_CALL, status, index, valIndex];
}

test.serial('exportFunction throws if passed invalid args', (t) => {
  // All args missing
  t.throws(() => exportFunction(undefined as any, undefined as any));

  // No Name
  t.throws(() => exportFunction('', noop));
  t.throws(() => exportFunction(undefined as any, noop));

  // No fn passed.
  t.throws(() => exportFunction('test', 7 as any));
  t.throws(() => exportFunction('test', undefined as any));
});

test.serial('exportFunction throws if fn was already exported', (t) => {
  exportFunction('abc', noop);
  t.throws(() => exportFunction('abc', noop));
});

test.serial('exportFunction succeeds without a return value', (t) => {
  exportFunction('abc', noop);
  t.pass();
});

test.serial.cb('callFunctionMessageHandler: function does not exist', (t) => {
  function transmitted(strings: Array<string>, message: MutationFromWorker) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      getFunctionMutation(
        ResolveOrReject.REJECT,
        strings.findIndex((str) => str.includes(`"abc" could not be found.`)),
      ),
    );
    t.end();
  }
  t.context.emitter.once(transmitted);

  callFunctionMessageHandler(getFunctionEvent('abc', []), t.context.document);
});
test.serial.cb('callFunctionMessageHandler rejects', (t) => {
  exportFunction('abc', () => Promise.reject('rejected message'));

  function transmitted(strings: Array<string>, message: MutationFromWorker) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      getFunctionMutation(
        ResolveOrReject.REJECT,
        strings.findIndex((str) => str.includes(`"rejected message"`)),
      ),
    );
    t.end();
  }
  t.context.emitter.once(transmitted);

  callFunctionMessageHandler(getFunctionEvent('abc', []), t.context.document);
});

test.serial.cb('callFunctionMessageHandler throws', (t) => {
  exportFunction('abc', () => {
    throw new Error('error message');
  });

  function transmitted(strings: Array<string>, message: MutationFromWorker) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      getFunctionMutation(
        ResolveOrReject.REJECT,
        strings.findIndex((str) => str.includes(`"error message"`)),
      ),
    );
    t.end();
  }
  t.context.emitter.once(transmitted);

  callFunctionMessageHandler(getFunctionEvent('abc', []), t.context.document);
});

test.serial.cb('callFunctionMessageHandler successful 0 args.', (t) => {
  exportFunction('abc', () => 'value');
  function transmitted(strings: Array<string>, message: MutationFromWorker) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      getFunctionMutation(
        ResolveOrReject.RESOLVE,
        strings.findIndex((str) => str === `"value"`),
      ),
    );
    t.end();
  }
  t.context.emitter.once(transmitted);

  callFunctionMessageHandler(getFunctionEvent('abc', []), t.context.document);
});

test.serial.cb('callFunctionMessageHandler successful N args.', (t) => {
  exportFunction('abc', (arg1: any, arg2: any) => [arg1, arg2]);
  function transmitted(strings: Array<string>, message: MutationFromWorker) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      getFunctionMutation(
        ResolveOrReject.RESOLVE,
        strings.findIndex((str) => str === `[12,"test"]`),
      ),
    );
    t.end();
  }
  t.context.emitter.once(transmitted);

  callFunctionMessageHandler(getFunctionEvent('abc', [12, 'test']), t.context.document);
});
