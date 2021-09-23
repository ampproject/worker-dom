import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
  callback: () => undefined;
  callbackTwo: () => false;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  t.context = {
    node: document.createElement('div'),
    callback: () => undefined,
    callbackTwo: () => false,
  };
});

test('event handlers are undefined by default', (t) => {
  const { node } = t.context;

  t.is(node[TransferrableKeys.handlers]['click'], undefined);
});

test('adding an event listener increases total registered events from 0 to 1 on a Node', (t) => {
  const { node, callback } = t.context;

  node.addEventListener('click', callback);
  t.is(node[TransferrableKeys.handlers]['click'].length, 1);
  t.is(node[TransferrableKeys.handlers]['click'][0], callback);
});

test('adding a second event listener increases total registered events from 0 to 2 on a Node', (t) => {
  const { node, callback, callbackTwo } = t.context;

  node.addEventListener('click', callback);
  t.is(node[TransferrableKeys.handlers]['click'].length, 1);
  t.is(node[TransferrableKeys.handlers]['click'][0], callback);
  t.is(node[TransferrableKeys.handlers]['click'][1], undefined);

  node.addEventListener('click', callbackTwo);
  t.is(node[TransferrableKeys.handlers]['click'].length, 2);
  t.is(node[TransferrableKeys.handlers]['click'][0], callback);
  t.is(node[TransferrableKeys.handlers]['click'][1], callbackTwo);
});
