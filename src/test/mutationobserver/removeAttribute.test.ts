import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationRecord, MutationRecordType } from '../../worker-thread/MutationRecord.js';
import { HTML_NAMESPACE } from '../../transfer/TransferrableNodes.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  document: Document;
}>;

test.beforeEach((t) => {
  t.context = {
    document: createTestingDocument(),
  };
});

test.serial('Element.removeAttribute mutation observed', async (t) => {
  return new Promise<void>((resolve) => {
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
      resolve();
    });

    el.setAttribute('data-foo', 'bar');
    document.body.appendChild(el);
    observer.observe(document.body);
    el.removeAttribute('data-foo');
  });
});

test.serial('Element.removeAttribute mutation observed, with namespace', async (t) => {
  return new Promise<void>((resolve) => {
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
      resolve();
    });

    el.setAttributeNS('namespace', 'data-foo', 'bar');
    document.body.appendChild(el);
    observer.observe(document.body);
    el.removeAttributeNS('namespace', 'data-foo');
  });
});
