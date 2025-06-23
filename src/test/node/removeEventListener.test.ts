import anyTest, { TestFn } from 'ava';
import { Element } from '../../worker-thread/dom/Element.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
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

test('removing the only registered callback retains array with zero length', (t) => {
  const { node, callback } = t.context;

  node.addEventListener('click', callback);
  node.removeEventListener('click', callback);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], []);
});

test('removing a specific callback from list with more than one callback reduces the list to the remaining callback', (t) => {
  const { node, callback, callbackTwo } = t.context;

  node.addEventListener('click', callback);
  node.addEventListener('click', callbackTwo);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], [callback, callbackTwo]);
  node.removeEventListener('click', callback);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], [callbackTwo]);
});

test('removing an unknown callback when callbacks are registerd to a type does nothing', (t) => {
  const { node, callback, callbackTwo } = t.context;

  node.addEventListener('click', callback);
  node.addEventListener('click', callbackTwo);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], [callback, callbackTwo]);
  node.removeEventListener('click', () => undefined);
  t.deepEqual(node[TransferrableKeys.handlers]['click'], [callback, callbackTwo]);
});

test('removing an unknown callback for a unknown type does nothing', (t) => {
  const { node } = t.context;

  node.removeEventListener('click', () => undefined);
  t.true(node[TransferrableKeys.handlers]['click'] === undefined);
});
