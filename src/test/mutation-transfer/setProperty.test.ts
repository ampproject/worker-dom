import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationFromWorker } from '../../transfer/Messages.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { emitter, Emitter } from '../Emitter.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { NumericBoolean } from '../../utils.js';

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

test.serial('HTMLOptionElement.selected transfers updated truthy property', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const el = document.createElement('option');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('selected'), NumericBoolean.TRUE, NumericBoolean.TRUE],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.selected = 'true';
    });
  });
});

test.serial('HTMLOptionElement.selected transfers updated falsy property', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const el = document.createElement('option');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('selected'), NumericBoolean.TRUE, NumericBoolean.FALSE],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.selected = null;
    });
  });
});

test.serial('HTMLOptionElement.selected transfers updated true boolean property', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const el = document.createElement('option');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('selected'), NumericBoolean.TRUE, NumericBoolean.TRUE],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.selected = true;
    });
  });
});

test.serial('HTMLOptionElement.selected transfers updated false boolean property', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const el = document.createElement('option');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('selected'), NumericBoolean.TRUE, NumericBoolean.FALSE],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.selected = false;
    });
  });
});

test.serial('HTMLInputElement.value transfers updated empty string', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const el = document.createElement('input');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('value'), NumericBoolean.FALSE, strings.indexOf('')],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      el.value = '';
    });
  });
});
