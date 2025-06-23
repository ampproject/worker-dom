import anyTest, { TestFn } from 'ava';
import { AMP } from '../../worker-thread/amp/amp.js';
import { Document } from '../../worker-thread/dom/Document.js';
import { GetOrSet } from '../../transfer/Messages.js';
import { StorageLocation } from '../../transfer/TransferrableStorage.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { expectMutations } from '../Emitter.js';
import { getForTesting } from '../../worker-thread/strings.js';

const test = anyTest as TestFn<{
  document: Document;
  amp: AMP;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const amp = new AMP(document);
  t.context = {
    document,
    amp,
  };
});

test.serial('AMP.getState(): string key', async (t) => {
  const { document, amp } = t.context;

  let addGlobalEventListenerCalled = false;
  document.addGlobalEventListener = () => {
    addGlobalEventListenerCalled = true;
  };

  return new Promise<void>((resolve) => {
    expectMutations(document, (mutations) => {
      t.true(addGlobalEventListenerCalled);
      t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.GET, StorageLocation.AmpState, getForTesting('foo')! + 1, 0]);
      resolve();
    });

    amp.getState('foo');
  });
});

test.serial('AMP.getState(): falsy key', async (t) => {
  const { document, amp } = t.context;

  let addGlobalEventListenerCalled = false;
  document.addGlobalEventListener = () => {
    addGlobalEventListenerCalled = true;
  };

  return new Promise<void>((resolve) => {
    expectMutations(document, (mutations) => {
      t.true(addGlobalEventListenerCalled);
      t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.GET, StorageLocation.AmpState, getForTesting('')! + 1, 0]);
      resolve();
    });

    (amp as any).getState();
  });
});

test.serial('AMP.setState()', async (t) => {
  const { document, amp } = t.context;

  return new Promise<void>((resolve) => {
    expectMutations(document, (mutations) => {
      t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.AmpState, 0, getForTesting('{"foo":"bar"}')! + 1]);
      resolve();
    });

    amp.setState({ foo: 'bar' });
  });
});
