import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
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

test.serial.cb('Element.setAttribute transfers new attribute', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.setAttribute('data-foo', 'bar');
  });
});

test.serial.cb('Element.setAttribute transfers attribute overwrite', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');
  el.setAttribute('data-foo', 'bar');

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.setAttribute('data-foo', 'baz');
  });
});

test.serial.cb('Element.setAttribute transfers new attribute with namespace', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.setAttributeNS('namespace', 'data-foo', 'bar');
  });
});

test.serial.cb('Element.setAttribute transfers attribute overwrite with namespace', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('div');
  el.setAttributeNS('namespace', 'data-foo', 'bar');

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.setAttributeNS('namespace', 'data-foo', 'baz');
  });
});
