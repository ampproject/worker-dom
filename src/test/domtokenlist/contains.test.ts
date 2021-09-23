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

test('by default nothing is contained', (t) => {
  const { tokenList } = t.context;

  t.is(tokenList.contains('foo'), false);
  t.is(tokenList.contains(''), false);
});

test('when only a single value is present, it is always contained', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  t.is(tokenList.contains('foo'), true);
  t.is(tokenList.contains('bar'), false);
  tokenList.value = 'foo foo';
  t.is(tokenList.contains('foo'), true);
  t.is(tokenList.contains('bar'), false);
});

test('when multiple values are present, they are correctly contained', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo bar';
  t.is(tokenList.contains('foo'), true);
  t.is(tokenList.contains('bar'), true);
  t.is(tokenList.contains('baz'), false);
  tokenList.value = 'foo bar foo bar';
  t.is(tokenList.contains('foo'), true);
  t.is(tokenList.contains('bar'), true);
  t.is(tokenList.contains('baz'), false);
});
