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

test.serial('removeChild mutation observed, first node', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const div = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(div);
    observer.observe(document.body);
    document.body.removeChild(div);
  });
});

test.serial('removeChild mutation observed, sibling node', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const div = document.createElement('div');
    const p = document.createElement('p');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(div);
    document.body.appendChild(p);
    observer.observe(document.body);
    document.body.removeChild(div);
  });
});

test.serial('removeChild mutation observed, multiple sibling nodes', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const div = document.createElement('div');
    const p = document.createElement('p');
    const input = document.createElement('input');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [div],
        },
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          removedNodes: [input],
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(div);
    document.body.appendChild(p);
    document.body.appendChild(input);
    observer.observe(document.body);
    document.body.removeChild(div);
    document.body.removeChild(input);
  });
});

test.serial('removeChild mutation observed, tree > 1 depth', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const div = document.createElement('div');
    const p = document.createElement('p');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: div,
          removedNodes: [p],
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(div);
    div.appendChild(p);
    observer.observe(document.body);
    div.removeChild(p);
  });
});
