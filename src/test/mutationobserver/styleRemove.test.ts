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
        value: '',
        oldValue: 'width: 10px;',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.width = '10px';
  observer.observe(document.body);
  el.style.width = '';
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
        value: '',
        oldValue: 'width: 10px;',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.setProperty('width', '10px');
  observer.observe(document.body);
  el.style.setProperty('width', '');
});

test.serial.cb('Element.style.width mutation observed, single value, via removeProperty', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'style',

        target: el,
        value: '',
        oldValue: 'width: 10px;',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.setProperty('width', '10px');
  observer.observe(document.body);
  el.style.removeProperty('width');
});

test.cb('Element.style.width mutation observed, single value, via cssText', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'style',

        target: el,
        value: '',
        oldValue: 'width: 10px;',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  appendKeys(['width']);
  el.style.cssText = 'width: 10px';
  observer.observe(document.body);
  el.style.cssText = '';
});
