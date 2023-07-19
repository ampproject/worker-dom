import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';
import { NodeType } from '../../transfer/TransferrableNodes';

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

test.serial.cb('document.createElement creation format is valid', (t) => {
  const { document, emitter } = t.context;
  const div = document.createElement('div');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.nodes] || [])),
      [div[TransferrableKeys.index], NodeType.ELEMENT_NODE, strings.indexOf(div.localName), 0, strings.indexOf(div.namespaceURI), 0],
      'creation format is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    document.body.appendChild(div);
  });
});


test.serial.cb('document.createElement creation format is valid for listenable properties', (t) => {
  const { document, emitter } = t.context;
  const audio = document.createElement('audio');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    t.deepEqual(
      Array.from(new Uint16Array(message[TransferrableKeys.nodes] || [])),
      [
        audio[TransferrableKeys.index],
        NodeType.ELEMENT_NODE,
        strings.indexOf(audio.localName),
        0,
        strings.indexOf(audio.namespaceURI),
        5,
        4,
        5,
        6,
        7,
        8,
      ],
      'creation format is as expected',
    );
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    document.body.appendChild(audio);
  });
});
