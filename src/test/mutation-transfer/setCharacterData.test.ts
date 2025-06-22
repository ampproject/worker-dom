import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationFromWorker } from '../../transfer/Messages.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
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

test.serial('Text, set data', async (t) => {
  const { document, emitter } = t.context;
  const text = document.createTextNode('original text');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.CHARACTER_DATA, text[TransferrableKeys.index], strings.indexOf('new text')],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      text.data = 'new text';
    });
  });
});

test.serial('Text, set textContent', async (t) => {
  const { document, emitter } = t.context;
  const text = document.createTextNode('original text');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.CHARACTER_DATA, text[TransferrableKeys.index], strings.indexOf('new text')],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      text.textContent = 'new text';
    });
  });
});
