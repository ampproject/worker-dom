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

test('getting position zero should return the correct value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  t.is(tokenList.item(0), 'foo');
  tokenList.value = 'foo bar';
  t.is(tokenList.item(0), 'foo');
  tokenList.value = 'foo bar foo';
  t.is(tokenList.item(0), 'foo');
  tokenList.value = 'bar foo';
  t.is(tokenList.item(0), 'bar');
});

test('getting last position should return the correct value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo';
  t.is(tokenList.item(tokenList.length - 1), 'foo');
  tokenList.value = 'foo bar';
  t.is(tokenList.item(tokenList.length - 1), 'bar');
  tokenList.value = 'foo bar foo';
  t.is(tokenList.item(tokenList.length - 1), 'foo');
  tokenList.value = 'bar foo';
  t.is(tokenList.item(tokenList.length - 1), 'foo');
});

test('getting middle positions should return the correct value', (t) => {
  const { tokenList } = t.context;

  tokenList.value = 'foo bar foo';
  t.is(tokenList.item(1), 'bar');
  tokenList.value = 'foo bar baz omega';
  t.is(tokenList.item(1), 'bar');
  t.is(tokenList.item(2), 'baz');
});
