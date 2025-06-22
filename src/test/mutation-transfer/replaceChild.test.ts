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

test.serial('Node.replaceChild transfer only node', async (t) => {
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
          0,
          1,
          1,
          p[TransferrableKeys.index],
          div[TransferrableKeys.index],
        ],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.replaceChild(p, div);
    });
  });
});

test.serial('Node.replaceChild transfer replace first with second', async (t) => {
  const { document, emitter } = t.context;
  const first = document.createElement('first');
  const second = document.createElement('second');
  const third = document.createElement('third');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.CHILD_LIST,
          document.body[TransferrableKeys.index],
          third[TransferrableKeys.index],
          0,
          1,
          1,
          second[TransferrableKeys.index],
          first[TransferrableKeys.index],
        ],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(first);
    document.body.appendChild(third);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.replaceChild(second, first);
    });
  });
});

test.serial('Node.replaceChild transfer replace third with second', async (t) => {
  const { document, emitter } = t.context;
  const first = document.createElement('first');
  const second = document.createElement('second');
  const third = document.createElement('third');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.CHILD_LIST,
          document.body[TransferrableKeys.index],
          0,
          0,
          1,
          1,
          second[TransferrableKeys.index],
          third[TransferrableKeys.index],
        ],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(first);
    document.body.appendChild(third);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.replaceChild(second, third);
    });
  });
});

test.serial('Node.replaceChild transfer remove sibling node', async (t) => {
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
          0,
          0,
          1,
          div[TransferrableKeys.index],
          TransferrableMutationType.CHILD_LIST,
          document.body[TransferrableKeys.index],
          0,
          0,
          1,
          1,
          div[TransferrableKeys.index],
          p[TransferrableKeys.index],
        ],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    document.body.appendChild(p);
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.replaceChild(div, p);
    });
  });
});
