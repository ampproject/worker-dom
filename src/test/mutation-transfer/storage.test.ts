import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { GetOrSet } from '../../transfer/Messages';
import { Storage, createStorage } from '../../worker-thread/Storage';
import { StorageLocation } from '../../transfer/TransferrableStorage';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { createTestingDocument } from '../DocumentCreation';
import { expectMutations } from '../Emitter';
import { getForTesting } from '../../worker-thread/strings';
import { setTimeout } from 'timers';

const test = anyTest as TestInterface<{
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

test.serial.cb('Storage.getItem', (t) => {
  const { document, storage } = t.context;

  let postMessageCalled = false;
  document.postMessage = () => (postMessageCalled = true);

  storage.getItem('foo');

  // getItem() should return local data, not invoke postMessage.
  setTimeout(() => {
    t.false(postMessageCalled);
    t.end();
  }, 0);
});

test.serial.cb('Storage.setItem', (t) => {
  const { document, storage } = t.context;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [
      TransferrableMutationType.STORAGE,
      GetOrSet.SET,
      StorageLocation.Local,
      getForTesting('foo')! + 1,
      getForTesting('bar')! + 1,
    ]);
    t.end();
  });

  storage.setItem('foo', 'bar');
});

test.serial.cb('Storage.removeItem', (t) => {
  const { document, storage } = t.context;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.Local, getForTesting('foo')! + 1, 0]);
    t.end();
  });

  storage.removeItem('foo');
});

test.serial.cb('Storage.clear', (t) => {
  const { document, storage } = t.context;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.Local, 0, 0]);
    t.end();
  });

  storage.clear();
});
