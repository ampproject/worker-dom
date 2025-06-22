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

test.serial('Element.classList.add transfer single value', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('class'), 0, strings.indexOf('bar') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.classList.add('bar');
    });
  });
});

test.serial('Element.classList.add transfer single override value', async (t) => {
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
      div.classList.add('bar');
    });
  });
});

test.serial('Element.classList.add transfer multiple values', async (t) => {
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

    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.classList.add('foo', 'bar');
    });
  });
});

test.serial('Element.classList.add mutation observed, multiple value to existing values', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('class'), 0, strings.indexOf('foo bar baz') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    div.classList.value = 'foo';
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.classList.add('bar', 'baz');
    });
  });
});
