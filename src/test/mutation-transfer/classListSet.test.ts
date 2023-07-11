import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';
import { serializeTransferableMessage } from '../../worker-thread/serializeTransferrableObject';

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

test.serial.cb('Element.classList.set transfer', (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    const expected = serializeTransferableMessage([TransferrableMutationType.ATTRIBUTES, div, 'class', 0, strings.indexOf('foo bar') + 1]);

    t.deepEqual(message[TransferrableKeys.mutations], [expected.buffer], 'mutation is as expected');
    t.end();
  }

  document.body.appendChild(div);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.classList.value = 'foo bar';
  });
});
