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
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('width: 12px;') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    appendKeys(['width']);
    div.style.width = '10px';
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.style.width = '12px';
    });
  });
});

test.serial('Element.style transfer multiple values', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const div = document.createElement('div');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.ATTRIBUTES,
          div[TransferrableKeys.index],
          strings.indexOf('style'),
          0,
          strings.indexOf('width: 14px; height: 12px;') + 1,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    appendKeys(['width', 'height']);
    div.style.width = '10px';
    div.style.height = '12px';
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.style.width = '14px';
    });
  });
});

test.serial('Element.style transfer single value, setProperty', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const div = document.createElement('div');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('width: 12px;') + 1],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    appendKeys(['width']);
    div.style.setProperty('width', '10px');
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.style.setProperty('width', '12px');
    });
  });
});

test.serial('Element.style.width mutation observed, multiple values, via cssText', async (t) => {
  return new Promise<void>((resolve) => {
    const { document, emitter } = t.context;
    const div = document.createElement('div');

    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.ATTRIBUTES,
          div[TransferrableKeys.index],
          strings.indexOf('style'),
          0,
          strings.indexOf('width: 12px; height: 14px;') + 1,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    document.body.appendChild(div);
    appendKeys(['width', 'height']);
    div.style.cssText = 'width: 10px; height: 12px';
    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.style.cssText = 'width: 12px; height: 14px';
    });
  });
});
