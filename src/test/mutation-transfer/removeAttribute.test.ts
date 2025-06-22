import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationFromWorker } from '../../transfer/Messages.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { emitter, Emitter } from '../Emitter.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { HTML_NAMESPACE } from '../../transfer/TransferrableNodes.js';

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

test.serial('Element.removeAttribute transfer', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('data-foo'), strings.indexOf(HTML_NAMESPACE), 0],
        'mutation is as expected',
      );
      resolve();
    }

    div.setAttribute('data-foo', 'foo');
    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.removeAttribute('data-foo');
    });
  });
});

test.serial('Element.removeAttribute transfer, with namespace', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('data-foo'), strings.indexOf('namespace'), 0],
        'mutation is as expected',
      );
      resolve();
    }

    div.setAttributeNS('namespace', 'data-foo', 'foo');
    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.removeAttributeNS('namespace', 'data-foo');
    });
  });
});
