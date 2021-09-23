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

test('toggle off a token', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  t.is(tokenList.toggle('foo'), false);
  t.is(tokenList.value, '');
});

test('toggle on a token', (t) => {
  const { tokenList } = t.context;

  tokenList.value = '';
  t.is(tokenList.toggle('foo'), true);
  t.is(tokenList.value, 'foo');
});

test('toggle off a token removes duplicates', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo foo';
  t.is(tokenList.toggle('foo'), false);
  t.is(tokenList.value, '');
});

test('toggle off a token removes duplicates and leaves other values', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('foo'), false);
  t.is(tokenList.value, 'bar');

  tokenList.value = 'foo foo bar bar';
  t.is(tokenList.toggle('foo'), false);
  t.is(tokenList.value, 'bar');
});

test('toggle on a token removes duplicates and leaves other values', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('baz'), true);
  t.is(tokenList.value, 'foo bar baz');

  tokenList.value = 'foo foo bar bar';
  t.is(tokenList.toggle('baz'), true);
  t.is(tokenList.value, 'foo bar baz');
});

test('toggle of multiple values throws an exception', (t) => {
  const { tokenList } = t.context;
  tokenList.value = 'one';

  const error = t.throws(
    () => {
      tokenList.toggle('one two');
    },
    { instanceOf: TypeError },
  );
  t.is(error.message, 'Uncaught DOMException');
});

test('toggle a token with force=false value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('foo', false), false);
  t.is(tokenList.value, 'bar');

  tokenList.value = 'foo foo bar bar';
  t.is(tokenList.toggle('foo', false), false);
  t.is(tokenList.value, 'bar');
});

test('toggle a token with force=true value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('foo', true), true);
  t.is(tokenList.value, 'foo foo bar');

  tokenList.value = 'foo foo bar bar';
  t.is(tokenList.toggle('foo', true), true);
  t.is(tokenList.value, 'foo foo bar bar');
});

test('toggle off token with falsey force value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('foo', ''), false);
  t.is(tokenList.value, 'bar');
});

test('toggle on a token with truthy force value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo foo bar';
  t.is(tokenList.toggle('foo', []), true);
  t.is(tokenList.value, 'foo foo bar');
});
