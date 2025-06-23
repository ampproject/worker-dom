import test from 'ava';
import { registerPromise, FunctionProcessor } from '../../../main-thread/commands/function.js';
import { StringContext } from '../../../main-thread/strings.js';
import { WorkerDOMConfiguration } from '../../../main-thread/configuration.js';
import { CommandExecutor } from '../../../main-thread/commands/interface.js';
import { TransferrableMutationType, FunctionMutationIndex } from '../../../transfer/TransferrableMutation.js';
import { ResolveOrReject } from '../../../transfer/Messages.js';

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
