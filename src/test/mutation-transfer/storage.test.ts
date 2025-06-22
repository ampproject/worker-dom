import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { GetOrSet } from '../../transfer/Messages.js';
import { Storage, createStorage } from '../../worker-thread/Storage.js';
import { StorageLocation } from '../../transfer/TransferrableStorage.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { expectMutations } from '../Emitter.js';
import { getForTesting } from '../../worker-thread/strings.js';
import { setTimeout } from 'timers';

const test = anyTest as TestFn<{
  document: Document;
  storage: Storage;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const storage = createStorage(document, StorageLocation.Local, {});

  t.context = {
    document,
    storage,
  };
});

test.serial('Storage.getItem', async (t) => {
  const { document, storage } = t.context;

  let postMessageCalled = false;
  document.postMessage = () => (postMessageCalled = true);

  storage.getItem('foo');

  // getItem() should return local data, not invoke postMessage.
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      t.false(postMessageCalled);
      resolve();
    }, 0);
  });
});

test.serial('Storage.setItem', async (t) => {
  const { document, storage } = t.context;

  return new Promise<void>((resolve) => {
    expectMutations(document, (mutations) => {
      t.deepEqual(mutations, [
        TransferrableMutationType.STORAGE,
        GetOrSet.SET,
        StorageLocation.Local,
        getForTesting('foo')! + 1,
        getForTesting('bar')! + 1,
      ]);
      resolve();
    });

    storage.setItem('foo', 'bar');
  });
});

test.serial('Storage.removeItem', async (t) => {
  const { document, storage } = t.context;

  return new Promise<void>((resolve) => {
    expectMutations(document, (mutations) => {
      t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.Local, getForTesting('foo')! + 1, 0]);
      resolve();
    });

    storage.removeItem('foo');
  });
});

test.serial('Storage.clear', async (t) => {
  const { document, storage } = t.context;

  return new Promise<void>((resolve) => {
    expectMutations(document, (mutations) => {
      t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.Local, 0, 0]);
      resolve();
    });

    storage.clear();
  });
});
