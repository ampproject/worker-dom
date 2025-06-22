import anyTest, { TestFn } from 'ava';
import { Text } from '../../worker-thread/dom/Text.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  text: Text;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    text: document.createTextNode('default value'),
  };
});

test('get textContent', (t) => {
  const { text } = t.context;

  t.is(text.textContent, 'default value');
});

test('set textContent', (t) => {
  const { text } = t.context;

  text.textContent = 'new value';
  t.is(text.textContent, 'new value');
});

test('textContent matches data', (t) => {
  const { text } = t.context;

  t.is(text.data, 'default value');
  t.is(text.textContent, 'default value');

  text.data = 'data setter';
  t.is(text.data, 'data setter');
  t.is(text.textContent, 'data setter');

  text.textContent = 'textContent setter';
  t.is(text.data, 'textContent setter');
  t.is(text.textContent, 'textContent setter');
});
