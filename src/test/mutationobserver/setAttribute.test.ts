import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord';
import { HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach((t) => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial.cb('Element.setAttribute mutation observed, new attribute', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'data-foo',
        attributeNamespace: HTML_NAMESPACE,
        target: el,
        value: 'bar',
        oldValue: '',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  observer.observe(document.body);
  el.setAttribute('data-foo', 'bar');
});

test.serial.cb('Element.setAttribute mutation observed, overwrite attribute', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'data-foo',
        attributeNamespace: HTML_NAMESPACE,
        target: el,
        value: 'baz',
        oldValue: 'bar',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  el.setAttribute('data-foo', 'bar');
  document.body.appendChild(el);
  observer.observe(document.body);
  el.setAttribute('data-foo', 'baz');
});

test.serial.cb('Element.setAttribute mutation observed, new attribute with namespace', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'data-foo',
        attributeNamespace: 'namespace',
        target: el,
        value: 'bar',
        oldValue: '',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  document.body.appendChild(el);
  observer.observe(document.body);
  el.setAttributeNS('namespace', 'data-foo', 'bar');
});

test.serial.cb('Element.setAttribute mutation observed, overwrite attribute with namespace', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'data-foo',
        attributeNamespace: 'namespace',
        target: el,
        value: 'baz',
        oldValue: 'bar',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  el.setAttributeNS('namespace', 'data-foo', 'bar');
  document.body.appendChild(el);
  observer.observe(document.body);
  el.setAttributeNS('namespace', 'data-foo', 'baz');
});
