import anyTest, { TestFn } from 'ava';
import { HTMLInputElement } from '../../worker-thread/dom/HTMLInputElement.js';
import { propagate } from '../../worker-thread/SyncValuePropagation.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { MessageType } from '../../transfer/Messages.js';
import { TransferrableSyncValue } from '../../transfer/TransferrableSyncValue.js';

const test = anyTest as TestFn<{
  element: HTMLInputElement;
  sendSyncMessage: (sync: TransferrableSyncValue) => void;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const element = document.createElement('input') as HTMLInputElement;

  let listener: Function = () => {};
  document.addGlobalEventListener = (_type: string, handler: Function) => {
    listener = handler;
  };
  propagate({ document } as any);

  t.context = {
    element,
    sendSyncMessage: (sync) =>
      listener({
        data: {
          [TransferrableKeys.type]: MessageType.SYNC,
          [TransferrableKeys.sync]: sync,
        },
      }),
  };
});

test('syncs value from the main thread', (t) => {
  const { element, sendSyncMessage } = t.context;

  sendSyncMessage({
    [TransferrableKeys.index]: element[TransferrableKeys.index],
    [TransferrableKeys.value]: 'abc',
  });

  t.is(element.value, 'abc');
});

test('syncs checked from the main thread', (t) => {
  const { element, sendSyncMessage } = t.context;

  sendSyncMessage({
    [TransferrableKeys.index]: element[TransferrableKeys.index],
    [TransferrableKeys.value]: 'on',
    [TransferrableKeys.checked]: true,
  });

  t.true(element.checked);

  sendSyncMessage({
    [TransferrableKeys.index]: element[TransferrableKeys.index],
    [TransferrableKeys.value]: 'on',
    [TransferrableKeys.checked]: false,
  });

  t.false(element.checked);
});

test('leaves checked untouched when the sync has no checked state', (t) => {
  const { element, sendSyncMessage } = t.context;

  element.checked = true;

  sendSyncMessage({
    [TransferrableKeys.index]: element[TransferrableKeys.index],
    [TransferrableKeys.value]: 'on',
  });

  t.true(element.checked);
});
