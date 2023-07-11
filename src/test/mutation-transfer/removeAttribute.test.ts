import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';
import { HTML_NAMESPACE } from '../../transfer/TransferrableNodes';
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

test.serial.cb('Element.removeAttribute transfer', (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    const expected = serializeTransferableMessage([TransferrableMutationType.ATTRIBUTES, div, 'data-foo', HTML_NAMESPACE, 0]);

    t.deepEqual(message[TransferrableKeys.mutations], [expected.buffer], 'mutation is as expected');
    t.end();
  }

  div.setAttribute('data-foo', 'foo');
  document.body.appendChild(div);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.removeAttribute('data-foo');
  });
});

test.serial.cb('Element.removeAttribute transfer, with namespace', (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    const expected = serializeTransferableMessage([TransferrableMutationType.ATTRIBUTES, div, 'data-foo', 'namespace', 0]);

    t.deepEqual(message[TransferrableKeys.mutations], [expected.buffer], 'mutation is as expected');
    t.end();
  }

  div.setAttributeNS('namespace', 'data-foo', 'foo');
  document.body.appendChild(div);
  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.removeAttributeNS('namespace', 'data-foo');
  });
});
