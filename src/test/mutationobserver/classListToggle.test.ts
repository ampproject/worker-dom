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

test.serial.cb('Element.classList.toggle mutation observed, toggle to remove', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  el.className = 'foo';
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'class',
        target: el,
        value: '',
        oldValue: 'foo',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  observer.observe(document.body);
  el.classList.toggle('foo');
});

test.serial.cb('Element.classList.toggle mutation observed, toggle to add', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  el.className = 'foo';
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'class',
        target: el,
        value: 'foo bar',
        oldValue: 'foo',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  observer.observe(document.body);
  el.classList.toggle('bar');
});
