import anyTest, { TestInterface } from 'ava';
import { FunctionProcessor, registerPromise } from '../../../main-thread/commands/function';
import { WorkerDOMConfiguration } from '../../../main-thread/configuration';
import { CommandExecutor } from '../../../main-thread/commands/interface';
import { FunctionMutationIndex, TransferrableMutationType } from '../../../transfer/TransferrableMutation';
import { ResolveOrReject } from '../../../transfer/Messages';

const test = anyTest as TestInterface<{}>;

function getFunctionProcessor(): CommandExecutor {
  return FunctionProcessor(
    undefined as any,
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
  const processor = getFunctionProcessor();
  const mutations: any[] = [];
  mutations[FunctionMutationIndex.Status] = ResolveOrReject.RESOLVE;
  mutations[FunctionMutationIndex.Index] = index;
  mutations[FunctionMutationIndex.Value] = JSON.stringify({ val: true });

  processor.execute(mutations, true);
  t.deepEqual(await promise, { val: true });
});

test('Is able to return undefined', async (t) => {
  const { promise, index } = registerPromise();
  const processor = getFunctionProcessor();
  const mutations: any[] = [];
  mutations[FunctionMutationIndex.Status] = ResolveOrReject.RESOLVE;
  mutations[FunctionMutationIndex.Index] = index;
  mutations[FunctionMutationIndex.Value] = JSON.stringify(undefined);

  processor.execute(mutations, true);
  t.deepEqual(await promise, undefined);
});

test('Returns the value of a rejected value', (t) => {
  const { promise, index } = registerPromise();
  const processor = getFunctionProcessor();
  const mutations: any[] = [];
  mutations[FunctionMutationIndex.Status] = ResolveOrReject.REJECT;
  mutations[FunctionMutationIndex.Index] = index;
  mutations[FunctionMutationIndex.Value] = JSON.stringify(`error message`);

  processor.execute(mutations, true);
  return promise.then(
    () => {
      t.fail();
    },
    (error) => {
      t.deepEqual(error, `error message`);
    },
  );
});
