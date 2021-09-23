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

test.serial.cb('replaceChild mutation, only node', (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
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
    t.end();
  });

  document.body.appendChild(div);
  observer.observe(document.body);
  document.body.replaceChild(p, div);
});

test.serial.cb('replaceChild mutation, replace first with second', (t) => {
  const { document } = t.context;
  const first = document.createElement('first');
  const second = document.createElement('second');
  const third = document.createElement('third');

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
    t.end();
  });

  document.body.appendChild(first);
  document.body.appendChild(third);
  observer.observe(document.body);
  document.body.replaceChild(second, first);
});

test.serial.cb('replaceChild mutation, replace third with second', (t) => {
  const { document } = t.context;
  const first = document.createElement('first');
  const second = document.createElement('second');
  const third = document.createElement('third');

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
    t.end();
  });

  document.body.appendChild(first);
  document.body.appendChild(third);
  observer.observe(document.body);
  document.body.replaceChild(second, third);
});

test.serial.cb('replaceChild mutation, remove sibling node', (t) => {
  const { document } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
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
    t.end();
  });

  document.body.appendChild(div);
  document.body.appendChild(p);
  observer.observe(document.body);
  document.body.replaceChild(div, p);
});
