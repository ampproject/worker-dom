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

test.serial('Text, set data', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const text = document.createTextNode('original text');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHARACTER_DATA,
          target: text,
          value: 'new text',
          oldValue: 'original text',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(text);
    observer.observe(document.body);
    text.data = 'new text';
  });
});

test.serial('Text, set textContent', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const text = document.createTextNode('original text');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.CHARACTER_DATA,
          target: text,
          value: 'new text',
          oldValue: 'original text',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(text);
    observer.observe(document.body);
    text.textContent = 'new text';
  });
});
