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

test.serial('Element.classList.add mutation observed, single value', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'class',
          target: el,
          value: 'bar',
          oldValue: '',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    observer.observe(document.body);
    el.classList.add('bar');
  });
});

test.serial('Element.classList.add mutation observed, single value to existing values', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    el.classList.value = 'foo';
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
      resolve();
    });

    document.body.appendChild(el);
    observer.observe(document.body);
    el.classList.add('bar');
  });
});

test.serial('Element.classList.add mutation observed, multiple values', async (t) => {
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
    el.classList.add('foo', 'bar');
  });
});

test.serial('Element.classList.add mutation observed, multiple value to existing values', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    el.classList.value = 'foo';
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'class',
          target: el,
          value: 'foo bar baz',
          oldValue: 'foo',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    observer.observe(document.body);
    el.classList.add('bar', 'baz');
  });
});
