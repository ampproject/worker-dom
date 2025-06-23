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

test.serial('Element.classList.toggle transfer remove single value', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('class'), 0, strings.indexOf('') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    div.classList.value = 'foo';
    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.classList.toggle('foo');
    });
  });
});

test.serial('Element.classList.toggle mutation observed, toggle to add', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('class'), 0, strings.indexOf('foo bar') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    div.classList.value = 'foo';
    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.classList.toggle('bar');
    });
  });
});
