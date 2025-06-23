import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  document: Document;
}>;

test.beforeEach((t) => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial('replaceChild mutation, only node', async (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  
  return new Promise<void>((resolve) => {
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
          addedNodes: [p],
          nextSibling: undefined,
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(div);
    observer.observe(document.body);
    document.body.replaceChild(p, div);
  });
});

test.serial('replaceChild mutation, replace first with second', async (t) => {
  const { document } = t.context;
  const first = document.createElement('first');
  const second = document.createElement('second');
  const third = document.createElement('third');

  return new Promise<void>((resolve) => {
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [first],
          addedNodes: [second],
          nextSibling: third,
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(first);
    document.body.appendChild(third);
    observer.observe(document.body);
    document.body.replaceChild(second, first);
  });
});

test.serial('replaceChild mutation, replace third with second', async (t) => {
  const { document } = t.context;
  const first = document.createElement('first');
  const second = document.createElement('second');
  const third = document.createElement('third');

  return new Promise<void>((resolve) => {
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [third],
          addedNodes: [second],
          nextSibling: undefined,
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(first);
    document.body.appendChild(third);
    observer.observe(document.body);
    document.body.replaceChild(second, third);
  });
});

test.serial('replaceChild mutation, remove sibling node', async (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  
  return new Promise<void>((resolve) => {
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.is(mutations.length, 2);
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
        },
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [p],
          addedNodes: [div],
          nextSibling: undefined,
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(div);
    document.body.appendChild(p);
    observer.observe(document.body);
    document.body.replaceChild(div, p);
  });
});
