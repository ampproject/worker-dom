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

test('remove a single value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  tokenList.remove('foo');
  t.is(tokenList.value, '');

  tokenList.value = 'foo foo';
  tokenList.remove('foo');
  t.is(tokenList.value, '', 'removing a single value that is stored more than once currently removes duplicates');

  tokenList.value = 'foo foo';
  tokenList.remove('bar');
  t.is(tokenList.value, 'foo', 'removing a single value not within stored values removes duplicates');

  tokenList.value = 'foo bar bar foo';
  tokenList.remove('foo');
  t.is(
    tokenList.value,
    'bar',
    'removing a single value that is stored more than once currently removes duplicates and leaves other unique values intact',
  );
});

test('removing multiple values', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo bar';
  tokenList.remove('foo', 'bar');
  t.is(tokenList.value, '');

  tokenList.value = 'foo foo';
  tokenList.remove('foo', 'foo');
  t.is(tokenList.value, '', 'removing multiple values of the same value that is stored more than once currently removes duplicates');

  tokenList.value = 'foo bar foo bar';
  tokenList.remove('foo', 'foo');
  t.is(
    tokenList.value,
    'bar',
    'removing multiple values of the same value that is stored more than once currently removes duplicates and leaves other unique values intact',
  );

  tokenList.value = 'foo bar foo bar';
  tokenList.remove('foo', 'bar');
  t.is(tokenList.value, '', 'removing multiple values can remove all values');
});
