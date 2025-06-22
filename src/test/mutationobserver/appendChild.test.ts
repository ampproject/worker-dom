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

test.serial('appendChild mutation observed, first node', async (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  
  return new Promise<void>((resolve) => {
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          addedNodes: [div],
          previousSibling: undefined,
        },
      ]);
      observer.disconnect();
      resolve();
    });

    observer.observe(document.body);
    document.body.appendChild(div);
  });
});

// TODO(KB): Tests must be run serially, observer callbacks are not occuring otherwise.
test.serial('appendChild mutation observed, sibling node', async (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  
  return new Promise<void>((resolve) => {
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: document.body,
          addedNodes: [p],
          previousSibling: div,
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(div);
    observer.observe(document.body);
    document.body.appendChild(p);
  });
});

test.serial('appendChild mutation observed, tree > 1 depth', async (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  
  return new Promise<void>((resolve) => {
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHILD_LIST,
          target: div,
          addedNodes: [p],
          previousSibling: undefined,
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(div);
    observer.observe(document.body);
    div.appendChild(p);
  });
});
