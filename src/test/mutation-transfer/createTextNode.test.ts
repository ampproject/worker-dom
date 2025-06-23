import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationFromWorker } from '../../transfer/Messages.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { emitter, Emitter } from '../Emitter.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { NodeType } from '../../transfer/TransferrableNodes.js';

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

test.serial('document.createTextNode creation format is valid', async (t) => {
  const { document, emitter } = t.context;
  const text = document.createTextNode('text');

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.nodes])),
        [text[TransferrableKeys.index], NodeType.TEXT_NODE, strings.indexOf('#text'), strings.indexOf('text'), 0],
        'creation format is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      document.body.appendChild(text);
    });
  });
});
