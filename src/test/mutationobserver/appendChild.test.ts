import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach((t) => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial.cb('appendChild mutation observed, first node', (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
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
    t.end();
  });

  observer.observe(document.body);
  document.body.appendChild(div);
});

// TODO(KB): Tests must be run serially, observer callbacks are not occuring otherwise.
test.serial.cb('appendChild mutation observed, sibling node', (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
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
    t.end();
  });

  document.body.appendChild(div);
  observer.observe(document.body);
  document.body.appendChild(p);
});

test.serial.cb('appendChild mutation observed, tree > 1 depth', (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
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
    t.end();
  });

  document.body.appendChild(div);
  observer.observe(document.body);
  div.appendChild(p);
});
