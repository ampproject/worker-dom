import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';
import { appendKeys } from '../../worker-thread/css/CSSStyleDeclaration';

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

test.serial.cb('Element.style transfer single value', (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('width: 12px;') + 1],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  appendKeys(['width']);
  div.style.width = '10px';
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.style.width = '12px';
  });
});

test.serial.cb('Element.style transfer multiple values', (t) => {
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
    t.end();
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

test.serial.cb('Element.style transfer single value, setProperty', (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('style'), 0, strings.indexOf('width: 12px;') + 1],
      'mutation is as expected',
    );
    t.end();
  }

  document.body.appendChild(div);
  appendKeys(['width']);
  div.style.setProperty('width', '10px');
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.style.setProperty('width', '12px');
  });
});

test.serial.cb('Element.style.width mutation observed, multiple values, via cssText', (t) => {
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
    t.end();
  }

  document.body.appendChild(div);
  appendKeys(['width', 'height']);
  div.style.cssText = 'width: 10px; height: 12px';
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.style.cssText = 'width: 12px; height: 14px';
  });
});
