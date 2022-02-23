import anyTest, { TestInterface } from 'ava';
import { StorageProcessor } from '../../../main-thread/commands/storage';
import { StringContext } from '../../../main-thread/strings';
import { WorkerDOMConfiguration } from '../../../main-thread/configuration';
import { CommandExecutor } from '../../../main-thread/commands/interface';
import { TransferrableMutationType, StorageMutationIndex } from '../../../transfer/TransferrableMutation';
import { StorageLocation } from '../../../transfer/TransferrableStorage';
import { GetOrSet, MessageToWorker, MessageType, StorageValueToWorker } from '../../../transfer/Messages';
import { WorkerContext } from '../../../main-thread/worker';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{}>;

type SetStorageMeta = { location: StorageLocation; key: string | null; value: string | null };

function getStorageProcessor(strings: string[]): {
  processor: CommandExecutor;
  messages: Array<MessageToWorker>;
  getLastSetStorage: () => any;
} {
  const stringCtx = new StringContext();
  stringCtx.storeValues(strings);
  const messages: Array<MessageToWorker> = [];
  let lastSetStorage: null | SetStorageMeta = null;

  const processor = StorageProcessor(
    stringCtx,
    undefined as any,
    {
      messageToWorker(m) {
        messages.push(m);
      },
    } as WorkerContext,
    undefined as any,
    {
      executorsAllowed: [TransferrableMutationType.STORAGE],
      sanitizer: {
        getStorage() {
          return Promise.resolve({ hello: 'world' });
        },
        setStorage(location: StorageLocation, key: string | null, value: string | null) {
          lastSetStorage = { location, key, value };
        },
      } as unknown as Sanitizer,
    } as WorkerDOMConfiguration,
  );
  return {
    processor,
    messages,
    getLastSetStorage: () => lastSetStorage,
  };
}

test('StorageProcessor sends storage value event to worker', async (t) => {
  const { processor, messages } = getStorageProcessor(['key']);
  const mutation: number[] = [];
  mutation[StorageMutationIndex.Operation] = GetOrSet.GET;
  mutation[StorageMutationIndex.Location] = StorageLocation.AmpState;
  mutation[StorageMutationIndex.Key] = 1;
  const mutations = new Uint16Array(mutation);

  processor.execute(mutations, 0, true);
  await Promise.resolve(setTimeout);

  const expectedMessage: StorageValueToWorker = {
    [TransferrableKeys.type]: MessageType.GET_STORAGE,
    [TransferrableKeys.storageKey]: 'key',
    [TransferrableKeys.storageLocation]: StorageLocation.AmpState,
    [TransferrableKeys.value]: { hello: 'world' },
  };
  t.is(messages.length, 1);
  t.deepEqual(messages, [expectedMessage]);
});

test('StorageProcessor handles deletion event from worker', async (t) => {
  const { processor, getLastSetStorage } = getStorageProcessor(['t', 'hello']);
  const mutation: number[] = [];
  mutation[StorageMutationIndex.Operation] = GetOrSet.SET;
  mutation[StorageMutationIndex.Location] = StorageLocation.Local;
  mutation[StorageMutationIndex.Key] = 2;
  mutation[StorageMutationIndex.Value] = 0;
  const mutations = new Uint16Array(mutation);

  processor.execute(mutations, 0, true);
  await Promise.resolve(setTimeout);

  t.deepEqual(getLastSetStorage(), { location: StorageLocation.Local, key: 'hello', value: null });
});
