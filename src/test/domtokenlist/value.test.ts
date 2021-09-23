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

test('getter should be empty by default', (t) => {
  const { tokenList } = t.context;

  t.is(tokenList.value, '');
});

test('should accept new total values via setter', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  t.is(tokenList.value, 'foo');
  tokenList.value = 'foo bar baz';
  t.is(tokenList.value, 'foo bar baz');
  tokenList.value = 'foo foo bar baz foo baz bar';
  t.is(tokenList.value, 'foo foo bar baz foo baz bar', 'duplicates are allowed and their position is retained');
});
