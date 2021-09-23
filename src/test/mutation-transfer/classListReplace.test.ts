import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';

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

test.serial.cb('Element.classList.replace transfer single pre-existing value', (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('class'), 0, strings.indexOf('bar') + 1],
      'mutation is as expected',
    );
    t.end();
  }

  div.classList.value = 'foo';
  document.body.appendChild(div);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.classList.replace('foo', 'bar');
  });
});

test.serial.cb('Element.classList.replace transfer multiple pre-existing values', (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
      [TransferrableMutationType.ATTRIBUTES, div[TransferrableKeys.index], strings.indexOf('class'), 0, strings.indexOf('bar baz') + 1],
      'mutation is as expected',
    );
    t.end();
  }

  div.classList.value = 'foo bar baz';
  document.body.appendChild(div);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.classList.replace('foo', 'bar');
  });
});
