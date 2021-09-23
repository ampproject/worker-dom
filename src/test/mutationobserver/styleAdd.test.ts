import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';
import { appendKeys } from '../../worker-thread/css/CSSStyleDeclaration';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach((t) => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial.cb('Element.style.width mutation observed, single value', (t) => {
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
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width']);
  observer.observe(document.body);
  el.style.width = '10px';
});

test.serial.cb('Element.style.height mutation observed, multiple values', (t) => {
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
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width', 'height']);
  el.style.width = '10px';
  observer.observe(document.body);
  el.style.height = '12px';
});

test.serial.cb('Element.style.width mutation observed, single value, via setProperty', (t) => {
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
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width']);
  observer.observe(document.body);
  el.style.setProperty('width', '10px');
});

test.serial.cb('Element.style.height mutation observed, multiple values, via setProperty', (t) => {
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
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width', 'height']);
  el.style.setProperty('width', '10px');
  observer.observe(document.body);
  el.style.setProperty('height', '12px');
});

test.serial.cb('Element.style.width mutation observed, single value, via cssText', (t) => {
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
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width']);
  observer.observe(document.body);
  el.style.cssText = 'width: 10px';
});

test.serial.cb('Element.style.width mutation observed, multiple values, via cssText', (t) => {
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
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width', 'height']);
  observer.observe(document.body);
  el.style.cssText = 'width: 10px; height: 12px';
});
