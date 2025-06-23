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

test.serial('Node.appendChild transfers new node', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.CHILD_LIST, document.body[TransferrableKeys.index], 0, 0, 1, 0, div[TransferrableKeys.index]],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.appendChild(div);
    });
  });
});

test.serial('Node.appendChild transfers new node, sibling node', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.CHILD_LIST,
          document.body[TransferrableKeys.index],
          0,
          div[TransferrableKeys.index],
          1,
          0,
          p[TransferrableKeys.index],
        ],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.appendChild(p);
    });
  });
});

test.serial('Node.appendChild transfers new node, tree > 1 depth', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.CHILD_LIST, div[TransferrableKeys.index], 0, 0, 1, 0, p[TransferrableKeys.index]],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.appendChild(p);
    });
  });
});
