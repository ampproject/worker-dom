import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationFromWorker } from '../../transfer/Messages.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { HTML_NAMESPACE } from '../../transfer/TransferrableNodes.js';
import { emitter, Emitter } from '../Emitter.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  document: Document;
  emitter: Emitter;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    emitter: emitter(document),
  };
});

test.serial('Element.setAttribute transfers new attribute', async (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.ATTRIBUTES,
          el[TransferrableKeys.index],
          strings.indexOf('data-foo'),
          strings.indexOf(HTML_NAMESPACE),
          strings.indexOf('bar') + 1,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.setAttribute('data-foo', 'bar');
    });
  });
});

test.serial('Element.setAttribute transfers attribute overwrite', async (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');
  el.setAttribute('data-foo', 'bar');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.ATTRIBUTES,
          el[TransferrableKeys.index],
          strings.indexOf('data-foo'),
          strings.indexOf(HTML_NAMESPACE),
          strings.indexOf('baz') + 1,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.setAttribute('data-foo', 'baz');
    });
  });
});

test.serial('Element.setAttribute transfers new attribute with namespace', async (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.ATTRIBUTES,
          el[TransferrableKeys.index],
          strings.indexOf('data-foo'),
          strings.indexOf('namespace'),
          strings.indexOf('bar') + 1,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.setAttributeNS('namespace', 'data-foo', 'bar');
    });
  });
});

test.serial('Element.setAttribute transfers attribute overwrite with namespace', async (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');
  el.setAttributeNS('namespace', 'data-foo', 'bar');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.ATTRIBUTES,
          el[TransferrableKeys.index],
          strings.indexOf('data-foo'),
          strings.indexOf('namespace'),
          strings.indexOf('baz') + 1,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.setAttributeNS('namespace', 'data-foo', 'baz');
    });
  });
});
