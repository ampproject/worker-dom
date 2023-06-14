import anyTest, { TestInterface } from 'ava';
import { AMP } from '../../worker-thread/amp/amp';
import { Document } from '../../worker-thread/dom/Document';
import { GetOrSet } from '../../transfer/Messages';
import { StorageLocation } from '../../transfer/TransferrableStorage';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { createTestingDocument } from '../DocumentCreation';
import { expectMutations } from '../Emitter';
import { getForTesting } from '../../worker-thread/strings';

const test = anyTest as TestInterface<{
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

test.serial.cb('AMP.getState(): string key', (t) => {
  const { document, amp } = t.context;

  let addGlobalEventListenerCalled = false;
  document.addGlobalEventListener = () => {
    addGlobalEventListenerCalled = true;
  };

  expectMutations(document, (mutations) => {
    t.true(addGlobalEventListenerCalled);
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.GET, StorageLocation.AmpState, getForTesting('foo')! + 1, 0]);
    t.end();
  });

  amp.getState('foo');
});

test.serial.cb('AMP.getState(): falsy key', (t) => {
  const { document, amp } = t.context;

  let addGlobalEventListenerCalled = false;
  document.addGlobalEventListener = () => {
    addGlobalEventListenerCalled = true;
  };

  expectMutations(document, (mutations) => {
    t.true(addGlobalEventListenerCalled);
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.GET, StorageLocation.AmpState, getForTesting('')! + 1, 0]);
    t.end();
  });

  (amp as any).getState();
});

test.serial.cb('AMP.setState()', (t) => {
  const { document, amp } = t.context;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [TransferrableMutationType.STORAGE, GetOrSet.SET, StorageLocation.AmpState, 0, getForTesting('{"foo":"bar"}')! + 1]);
    t.end();
  });

  amp.setState({ foo: 'bar' });
});
