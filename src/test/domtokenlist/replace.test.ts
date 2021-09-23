import anyTest, { TestInterface } from 'ava';
import { DOMTokenList } from '../../worker-thread/dom/DOMTokenList';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  tokenList: DOMTokenList;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    tokenList: new DOMTokenList(document.createElement('div'), 'class'),
  };
});

test('replace a single value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  tokenList.replace('foo', '');
  t.is(tokenList.value, '');

  tokenList.value = 'foo bar';
  tokenList.replace('foo', 'baz');
  t.is(tokenList.value, 'bar baz');

  tokenList.value = 'foo foo bar';
  tokenList.replace('bar', 'baz');
  t.is(tokenList.value, 'foo baz');

  tokenList.value = 'foo foo bar';
  tokenList.replace('foo', 'baz');
  t.is(tokenList.value, 'bar baz');

  tokenList.value = 'foo foo bar';
  tokenList.replace('foo', 'foo');
  t.is(tokenList.value, 'foo bar');
});

test('replace an invalid value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  tokenList.replace('bar', '');
  t.is(tokenList.value, 'foo', 'when value is requested to be replaced that does not exist, the value is unchanged');

  tokenList.value = 'foo bar';
  tokenList.replace('', 'baz');
  t.is(tokenList.value, 'foo bar', 'when value is requested to be replaced that does not exist, the value is unchanged');

  tokenList.value = 'foo foo bar';
  tokenList.replace('baz', 'omega');
  t.is(tokenList.value, 'foo foo bar', 'when value is requested to be replaced that does not exist, the value is unchanged');
});
