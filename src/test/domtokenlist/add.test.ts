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

test('adding a single value', (t) => {
  const { tokenList } = t.context;

  tokenList.add('foo');
  t.is(tokenList.value, 'foo');
  tokenList.add('foo');
  t.is(tokenList.value, 'foo', 'adding a duplicate does not change the value, if there are no duplicates in the value');

  tokenList.value = 'foo foo';
  tokenList.add('bar');
  t.is(tokenList.value, 'foo bar', 'adding a new single value removes duplicates');

  tokenList.value = 'foo bar bar foo';
  tokenList.add('baz');
  t.is(tokenList.value, 'foo bar baz', 'adding a new single value removes all duplicates');

  tokenList.value = 'foo foo';
  tokenList.add('foo');
  t.is(tokenList.value, 'foo', 'adding a duplicate value removes duplicates');

  tokenList.value = 'foo bar bar foo';
  tokenList.add('foo');
  t.is(tokenList.value, 'foo bar', 'adding a duplicate value removes all duplicates');
});

test('adding multiple values', (t) => {
  const { tokenList } = t.context;

  tokenList.add('foo', 'bar');
  t.is(tokenList.value, 'foo bar');
  tokenList.add('foo', 'bar');
  t.is(tokenList.value, 'foo bar', 'adding duplicates does not change the value, if there are no duplicates in the value');

  tokenList.value = 'foo foo';
  tokenList.add('foo', 'bar');
  t.is(tokenList.value, 'foo bar', 'adding multiple values removes duplicates');

  tokenList.value = 'foo bar bar foo';
  tokenList.add('foo', 'bar', 'baz');
  t.is(tokenList.value, 'foo bar baz', 'adding multiple values removes all duplicates');

  tokenList.value = 'foo foo';
  tokenList.add('foo', 'foo');
  t.is(tokenList.value, 'foo', 'adding multiple of the same value removes duplicates');

  tokenList.value = 'foo bar bar foo';
  tokenList.add('baz', 'foo', 'omega');
  t.is(tokenList.value, 'foo bar baz omega', 'adding multiple new values removes all duplicates');
});
