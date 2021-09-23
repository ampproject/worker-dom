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

test.serial.cb('Text, set data', (t) => {
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
    t.end();
  });

  document.body.appendChild(text);
  observer.observe(document.body);
  text.data = 'new text';
});

test.serial.cb('Text, set textContent', (t) => {
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
    t.end();
  });

  document.body.appendChild(text);
  observer.observe(document.body);
  text.textContent = 'new text';
});
