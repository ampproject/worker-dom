import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord.js';
import { appendKeys } from '../../worker-thread/css/CSSStyleDeclaration.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  document: Document;
}>;

test.beforeEach((t) => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial('Element.style.width mutation observed, single value', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: 'width: 10px;',
          oldValue: '',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    appendKeys(['width']);
    observer.observe(document.body);
    el.style.width = '10px';
  });
});

test.serial('Element.style.height mutation observed, multiple values', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: 'width: 10px; height: 12px;',
          oldValue: 'width: 10px;',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    appendKeys(['width', 'height']);
    el.style.width = '10px';
    observer.observe(document.body);
    el.style.height = '12px';
  });
});

test.serial('Element.style.width mutation observed, single value, via setProperty', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: 'width: 10px;',
          oldValue: '',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    appendKeys(['width']);
    observer.observe(document.body);
    el.style.setProperty('width', '10px');
  });
});

test.serial('Element.style.height mutation observed, multiple values, via setProperty', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: 'width: 10px; height: 12px;',
          oldValue: 'width: 10px;',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    appendKeys(['width', 'height']);
    el.style.setProperty('width', '10px');
    observer.observe(document.body);
    el.style.setProperty('height', '12px');
  });
});

test.serial('Element.style.width mutation observed, single value, via cssText', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: 'width: 10px;',
          oldValue: '',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    appendKeys(['width']);
    observer.observe(document.body);
    el.style.cssText = 'width: 10px';
  });
});

test.serial('Element.style.width mutation observed, multiple values, via cssText', async (t) => {
  return new Promise<void>((resolve) => {
    const { document } = t.context;
    const el = document.createElement('div');
    const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
      t.deepEqual(mutations, [
        {
          type: MutationRecordType.ATTRIBUTES,
          attributeName: 'style',

          target: el,
          value: 'width: 10px; height: 12px;',
          oldValue: '',
        },
      ]);
      observer.disconnect();
      resolve();
    });

    document.body.appendChild(el);
    appendKeys(['width', 'height']);
    observer.observe(document.body);
    el.style.cssText = 'width: 10px; height: 12px';
  });
});
