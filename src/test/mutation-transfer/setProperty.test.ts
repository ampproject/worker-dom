import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';
import { NumericBoolean } from '../../utils';

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

test.serial.cb('HTMLOptionElement.selected transfers updated truthy property', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('option');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('selected'), NumericBoolean.TRUE, NumericBoolean.TRUE],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.selected = 'true';
  });
});

test.serial.cb('HTMLOptionElement.selected transfers updated falsy property', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('option');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('selected'), NumericBoolean.TRUE, NumericBoolean.FALSE],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.selected = null;
  });
});

test.serial.cb('HTMLOptionElement.selected transfers updated true boolean property', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('option');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('selected'), NumericBoolean.TRUE, NumericBoolean.TRUE],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.selected = true;
  });
});

test.serial.cb('HTMLOptionElement.selected transfers updated false boolean property', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('option');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('selected'), NumericBoolean.TRUE, NumericBoolean.FALSE],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.selected = false;
  });
});

test.serial.cb('HTMLInputElement.value transfers updated empty string', (t) => {
  const { document, emitter } = t.context;
  const el = document.createElement('input');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.PROPERTIES, el[TransferrableKeys.index], strings.indexOf('value'), NumericBoolean.FALSE, strings.indexOf('')],
      'mutation is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    el.value = '';
  });
});
