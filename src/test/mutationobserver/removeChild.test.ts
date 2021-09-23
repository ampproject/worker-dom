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

test.serial.cb('removeChild mutation observed, first node', (t) => {
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
    t.end();
  });

  document.body.appendChild(div);
  observer.observe(document.body);
  document.body.removeChild(div);
});

test.serial.cb('removeChild mutation observed, sibling node', (t) => {
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
    t.end();
  });

  document.body.appendChild(div);
  document.body.appendChild(p);
  observer.observe(document.body);
  document.body.removeChild(div);
});

test.serial.cb('removeChild mutation observed, multiple sibling nodes', (t) => {
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
    t.end();
  });

  document.body.appendChild(div);
  document.body.appendChild(p);
  document.body.appendChild(input);
  observer.observe(document.body);
  document.body.removeChild(div);
  document.body.removeChild(input);
});

test.serial.cb('removeChild mutation observed, tree > 1 depth', (t) => {
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
    t.end();
  });

  document.body.appendChild(div);
  div.appendChild(p);
  observer.observe(document.body);
  div.removeChild(p);
});
