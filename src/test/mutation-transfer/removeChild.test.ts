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

test.serial('Node.removeChild transfer only child', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.CHILD_LIST, document.body[TransferrableKeys.index], 0, 0, 0, 1, div[TransferrableKeys.index]],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.removeChild(div);
    });
  });
});

test.serial('Node.removeChild transfer, one of siblings', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.CHILD_LIST, document.body[TransferrableKeys.index], 0, 0, 0, 1, div[TransferrableKeys.index]],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    document.body.appendChild(p);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.removeChild(div);
    });
  });
});

test.serial('Node.removeChild transfer, multiple sibling nodes', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');
  const input = document.createElement('input');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.CHILD_LIST,
          document.body[TransferrableKeys.index],
          0,
          0,
          0,
          1,
          div[TransferrableKeys.index],
          TransferrableMutationType.CHILD_LIST,
          document.body[TransferrableKeys.index],
          0,
          0,
          0,
          1,
          input[TransferrableKeys.index],
        ],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    document.body.appendChild(p);
    document.body.appendChild(input);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.removeChild(div);
      document.body.removeChild(input);
    });
  });
});

test.serial('Node.removeChild transfer, tree > 1 depth', async (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');
  const p = document.createElement('p');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.CHILD_LIST, div[TransferrableKeys.index], 0, 0, 0, 1, p[TransferrableKeys.index]],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    div.appendChild(p);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.removeChild(p);
    });
  });
});
