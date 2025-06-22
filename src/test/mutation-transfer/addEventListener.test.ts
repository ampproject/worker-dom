import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { MutationFromWorker } from '../../transfer/Messages.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { emitter, Emitter } from '../Emitter.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { Element } from '../../worker-thread/dom/Element.js';
import { Event } from '../../worker-thread/Event.js';
import { NumericBoolean } from '../../utils.js';

const test = anyTest as TestFn<{
  document: Document;
  div: Element;
  eventHandler: (e: Event) => any;
  emitter: Emitter;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const div = document.createElement('div');

  function eventHandler(e: Event) {
    console.log(e, 'yay');
  }

  t.context = {
    document,
    div,
    eventHandler,
    emitter: emitter(document),
  };
});

test.serial('Node.addEventListener transfers an event subscription', async (t) => {
  const { div, eventHandler, emitter } = t.context;

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.addEventListener('click', eventHandler);
    });
  });
});

test.serial('Node.addEventListener(..., {capture: true}) transfers an event subscription', async (t) => {
  const { div, eventHandler, emitter } = t.context;

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.TRUE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.addEventListener('click', eventHandler, { capture: true });
    });
  });
});

test.serial('Node.addEventListener(..., {once: true}) transfers an event subscription', async (t) => {
  const { div, eventHandler, emitter } = t.context;

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.FALSE,
          NumericBoolean.TRUE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.addEventListener('click', eventHandler, { once: true });
    });
  });
});

test.serial('Node.addEventListener(..., {passive: true}) transfers an event subscription', async (t) => {
  const { div, eventHandler, emitter } = t.context;

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.TRUE,
          NumericBoolean.FALSE,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.addEventListener('click', eventHandler, { passive: true });
    });
  });
});

test.serial('Node.addEventListener(..., {workerDOMPreventDefault: true}) transfers an event subscription', async (t) => {
  const { div, eventHandler, emitter } = t.context;

  return new Promise<void>((resolve) => {
    function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
      t.deepEqual(
        Array.from(new Uint16Array(message[TransferrableKeys.mutations])),
        [
          TransferrableMutationType.EVENT_SUBSCRIPTION,
          div[TransferrableKeys.index],
          0,
          1,
          strings.indexOf('click'),
          0, // This is the first event registered.
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.FALSE,
          NumericBoolean.TRUE,
        ],
        'mutation is as expected',
      );
      resolve();
    }

    Promise.resolve().then(() => {
      emitter.once(transmitted);
      div.addEventListener('click', eventHandler, {
        workerDOMPreventDefault: true,
      });
    });
  });
});
