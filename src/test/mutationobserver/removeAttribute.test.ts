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

test.serial.cb('Element.removeAttribute mutation observed', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'data-foo',
        attributeNamespace: HTML_NAMESPACE,
        target: el,
        oldValue: 'bar',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  el.setAttribute('data-foo', 'bar');
  document.body.appendChild(el);
  observer.observe(document.body);
  el.removeAttribute('data-foo');
});

test.serial.cb('Element.removeAttribute mutation observed, with namespace', (t) => {
  const { document } = t.context;
  const el = document.createElement('div');
  const observer = new document.defaultView.MutationObserver((mutations: MutationRecord[]): void => {
    t.deepEqual(mutations, [
      {
        type: MutationRecordType.ATTRIBUTES,
        attributeName: 'data-foo',
        attributeNamespace: 'namespace',
        target: el,
        oldValue: 'bar',
      },
    ]);
    observer.disconnect();
    t.end();
  });

  el.setAttributeNS('namespace', 'data-foo', 'bar');
  document.body.appendChild(el);
  observer.observe(document.body);
  el.removeAttributeNS('namespace', 'data-foo');
});
