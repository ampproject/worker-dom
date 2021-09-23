import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';
import { Element } from '../../worker-thread/dom/Element';
import { Event } from '../../worker-thread/Event';
import { NumericBoolean } from '../../utils';

const test = anyTest as TestInterface<{
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

test.serial.cb('Node.addEventListener transfers an event subscription', (t) => {
  const { div, eventHandler, emitter } = t.context;

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.addEventListener('click', eventHandler);
  });
});

test.serial.cb('Node.addEventListener(..., {capture: true}) transfers an event subscription', (t) => {
  const { div, eventHandler, emitter } = t.context;

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.addEventListener('click', eventHandler, { capture: true });
  });
});

test.serial.cb('Node.addEventListener(..., {once: true}) transfers an event subscription', (t) => {
  const { div, eventHandler, emitter } = t.context;

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.addEventListener('click', eventHandler, { once: true });
  });
});

test.serial.cb('Node.addEventListener(..., {passive: true}) transfers an event subscription', (t) => {
  const { div, eventHandler, emitter } = t.context;

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.addEventListener('click', eventHandler, { passive: true });
  });
});

test.serial.cb('Node.addEventListener(..., {workerDOMPreventDefault: true}) transfers an event subscription', (t) => {
  const { div, eventHandler, emitter } = t.context;

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
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    div.addEventListener('click', eventHandler, {
      workerDOMPreventDefault: true,
    });
  });
});
