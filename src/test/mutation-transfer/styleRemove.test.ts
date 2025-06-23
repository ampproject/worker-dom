import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationFromWorker } from '../../transfer/Messages.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { emitter, Emitter } from '../Emitter.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { appendKeys } from '../../worker-thread/css/CSSStyleDeclaration.js';

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

test.serial('Element.style transfer single value', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const div = document.createElement('div');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    appendKeys(['width']);
    div.style.width = '10px';
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.style.width = '';
    });
  });
});

test.serial('Element.style transfer single value, via setProperty', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const div = document.createElement('div');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    appendKeys(['width']);
    div.style.setProperty('width', '10px');
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.style.setProperty('width', '');
    });
  });
});

test.serial('Element.style transfer single value, via removeProperty', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const div = document.createElement('div');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    appendKeys(['width']);
    div.style.setProperty('width', '10px');
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.style.removeProperty('width');
    });
  });
});

test('Element.style transfer single value, via cssText', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const div = document.createElement('div');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    appendKeys(['width']);
    div.style.cssText = 'width: 10px';
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.style.cssText = '';
    });
  });
});
