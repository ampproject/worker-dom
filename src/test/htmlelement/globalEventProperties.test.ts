import anyTest, { TestInterface } from 'ava';
import { HTMLElement, appendGlobalEventProperties } from '../../worker-thread/dom/HTMLElement';
import { createTestingDocument } from '../DocumentCreation';
import { Document } from '../../worker-thread/dom/Document';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{
  document: Document;
  element: HTMLElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    element: document.createElement('div') as HTMLElement,
  };
});

test.serial('appending keys mutates existing instance', (t) => {
  const { element } = t.context;

  t.is(element.onclick, undefined);
  appendGlobalEventProperties(['onclick']);
  t.is(element.onclick, null);
});

test.serial('previously appended keys should exist on newly created instances', (t) => {
  const { document } = t.context;
  const newElement = document.createElement('div');

  t.is(newElement.onclick, null);
});

test.serial('subscription uses only assigned value', (t) => {
  const { element } = t.context;
  const handler = (e: any) => console.log(e);

  t.is(element.onclick, null);
  element.onclick = handler;
  t.is(element.onclick, handler);
});

test.serial('subscription uses only last assigned value', (t) => {
  const { element } = t.context;
  const handler = (e: any) => console.log('one', e);
  const handlerTwo = (e: any) => console.log('two', e);

  t.is(element.onclick, null);
  element.onclick = handler;
  t.is(element.onclick, handler);
  element.onclick = handlerTwo;
  t.is(element.onclick, handlerTwo);
});

test('appending keys mutates all known instances', (t) => {
  const { document } = t.context;
  const firstElement = document.createElement('div');
  const secondElement = document.createElement('div');

  t.is(firstElement.onmouseenter, undefined);
  t.is(secondElement.onmouseenter, undefined);
  appendGlobalEventProperties(['onmouseenter']);
  t.is(firstElement.onmouseenter, null);
  t.is(secondElement.onmouseenter, null);
});

test('reappending a key does not cause an error', (t) => {
  const { element } = t.context;
  appendGlobalEventProperties(['onmouseexit']);
  appendGlobalEventProperties(['onmouseexit']);

  t.is(element.onmouseexit, null);
});

test('appending as many keys as there are TransferrableKeys functions', (t) => {
  const { element } = t.context;
  const handler = (e: any) => console.log(e);
  appendGlobalEventProperties(['ontouchmove']);
  appendGlobalEventProperties(Array.from(Array(TransferrableKeys.END), (d, i) => i + 'key'));

  t.is(element.ontouchmove, null);
  element.ontouchmove = handler;
  t.is(element.ontouchmove, handler);
});
