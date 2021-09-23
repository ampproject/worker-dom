import anyTest, { TestInterface } from 'ava';
import { exportFunction, callFunctionMessageHandler, resetForTesting } from '../../worker-thread/function';
import { createTestingDocument } from '../DocumentCreation';
import { MutationFromWorker, ResolveOrReject, MessageType } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { Document } from '../../worker-thread/dom/Document';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { getForTestingPartial } from '../../worker-thread/strings';
import * as phase from '../../worker-thread/phase';
import { Phase } from '../../transfer/Phase';

const noop = () => {};

const test = anyTest as TestInterface<{
  document: Document;
  mutationPromise: Promise<number[]>;
}>;

test.beforeEach((t) => {
  phase.set(Phase.Initializing);
  resetForTesting();
  const document = createTestingDocument();
  document[TransferrableKeys.observe]();

  const mutationPromise: any = new Promise((resolve) => {
    document.postMessage = (message: MutationFromWorker) => {
      const mutation = Array.from(new Uint16Array(message[TransferrableKeys.mutations]));
      resolve(mutation);
    };
  });

  t.context = { document, mutationPromise };
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
function getFunctionMutation(status: ResolveOrReject, valIndex: number | undefined): Array<any> {
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

test.serial('callFunctionMessageHandler unexported fn', async (t) => {
  callFunctionMessageHandler(getFunctionEvent('abc', []), t.context.document);

  const mutation = await t.context.mutationPromise;
  t.deepEqual(mutation, getFunctionMutation(ResolveOrReject.REJECT, getForTestingPartial(`abc`)));
});

test.serial('callFunctionMessageHandler rejects', async (t) => {
  exportFunction('abc', () => Promise.reject('rejected message'));
  callFunctionMessageHandler(getFunctionEvent('abc', []), t.context.document);

  const mutation = await t.context.mutationPromise;
  t.deepEqual(mutation, getFunctionMutation(ResolveOrReject.REJECT, getForTestingPartial(`rejected message`)));
});

test.serial('callFunctionMessageHandler throws', async (t) => {
  exportFunction('abc', () => {
    throw new Error('error message');
  });
  callFunctionMessageHandler(getFunctionEvent('abc', []), t.context.document);

  const mutation = await t.context.mutationPromise;
  t.deepEqual(mutation, getFunctionMutation(ResolveOrReject.REJECT, getForTestingPartial(`error message`)));
});

test.serial('callFunctionMessageHandler successful 0 args.', async (t) => {
  exportFunction('abc', () => 'value');
  callFunctionMessageHandler(getFunctionEvent('abc', []), t.context.document);

  const mutation = await t.context.mutationPromise;
  t.deepEqual(mutation, getFunctionMutation(ResolveOrReject.RESOLVE, getForTestingPartial(`"value"`)));
});

test.serial('callFunctionMessageHandler successful N args.', async (t) => {
  exportFunction('abc', (arg1: any, arg2: any) => [arg1, arg2]);
  callFunctionMessageHandler(getFunctionEvent('abc', [12, 'test']), t.context.document);

  const mutation = await t.context.mutationPromise;
  t.deepEqual(mutation, getFunctionMutation(ResolveOrReject.RESOLVE, getForTestingPartial(`[12,"test"]`)));
});
