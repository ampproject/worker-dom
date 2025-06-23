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

test('Element.classList.set mutation observed', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'class',
          target: el,
          value: 'foo bar',
          oldValue: '',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    observer.observe(document.body);
    el.classList.value = 'foo bar';
  });
});
