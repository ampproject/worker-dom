import anyTest, { TestInterface } from 'ava';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLAnchorElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('a') as HTMLAnchorElement,
  };
});

test('relList should be empty by default', (t) => {
  const { element } = t.context;

  t.is(element.relList.value, '');
  t.is(element.getAttribute('rel'), null);
});

test('relList.add of a single value should only add one class', (t) => {
  const { element } = t.context;

  element.relList.add('foo');
  t.is(element.relList.value, 'foo');
  t.is(element.rel, 'foo');
  t.is(element.getAttribute('rel'), 'foo');
});

test('relList.add of a multiple value should only add all classes', (t) => {
  const { element } = t.context;

  element.relList.add('foo', 'bar', 'baz');
  t.is(element.relList.value, 'foo bar baz');
  t.is(element.rel, 'foo bar baz');
  t.is(element.getAttribute('rel'), 'foo bar baz');
});

test('relList.remove of a single value should only remove one class', (t) => {
  const { element } = t.context;

  element.rel = 'foo bar';
  element.relList.remove('foo');
  t.is(element.relList.value, 'bar');
  t.is(element.rel, 'bar');
  t.is(element.getAttribute('rel'), 'bar');
});

test('relList.remove of a multiple values should remove all values', (t) => {
  const { element } = t.context;

  element.rel = 'foo bar baz';
  element.relList.remove('foo', 'bar');
  t.is(element.relList.value, 'baz');
  t.is(element.rel, 'baz');
  t.is(element.getAttribute('rel'), 'baz');
});

test('relList.toggle should add a value that is not present already', (t) => {
  const { element } = t.context;

  element.relList.toggle('foo');
  t.is(element.relList.value, 'foo');
  t.is(element.rel, 'foo');
  t.is(element.getAttribute('rel'), 'foo');
});

test('relList.toggle should remove a value that is present already', (t) => {
  const { element } = t.context;

  element.rel = 'foo';
  element.relList.toggle('foo');
  t.is(element.relList.value, '');
  t.is(element.rel, '');
  t.is(element.getAttribute('rel'), '');
});
