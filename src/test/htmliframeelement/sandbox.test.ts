import anyTest, { TestInterface } from 'ava';
import { HTMLIFrameElement } from '../../worker-thread/dom/HTMLIFrameElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: HTMLIFrameElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('iframe') as HTMLIFrameElement,
  };
});

test('sandbox should be empty by default', (t) => {
  const { element } = t.context;

  t.is(element.sandbox.value, '');
  t.is(element.getAttribute('sandbox'), null);
});

test('setAttribute should modify sandbox property', (t) => {
  const { element } = t.context;

  element.setAttribute('sandbox', 'allow-forms allow-modals');
  t.is(element.sandbox.value, 'allow-forms allow-modals');
  t.is(element.getAttribute('sandbox'), 'allow-forms allow-modals');
});

test('sandbox.add of a single value should only add one class', (t) => {
  const { element } = t.context;

  element.sandbox.add('allow-forms');
  t.is(element.sandbox.value, 'allow-forms');
  t.is(element.getAttribute('sandbox'), 'allow-forms');
});

test('sandbox.add of a multiple value should only add all classes', (t) => {
  const { element } = t.context;

  element.sandbox.add('allow-forms', 'allow-modals', 'allow-orientation-lock');
  t.is(element.sandbox.value, 'allow-forms allow-modals allow-orientation-lock');
  t.is(element.getAttribute('sandbox'), 'allow-forms allow-modals allow-orientation-lock');
});

test('sandbox.remove of a single value should only remove one class', (t) => {
  const { element } = t.context;

  element.sandbox.value = 'allow-forms allow-modals';
  element.sandbox.remove('allow-forms');
  t.is(element.sandbox.value, 'allow-modals');
  t.is(element.getAttribute('sandbox'), 'allow-modals');
});

test('sandbox.remove of a multiple values should remove all values', (t) => {
  const { element } = t.context;

  element.sandbox.value = 'allow-forms allow-modals allow-orientation-lock';
  element.sandbox.remove('allow-forms', 'allow-modals');
  t.is(element.sandbox.value, 'allow-orientation-lock');
  t.is(element.getAttribute('sandbox'), 'allow-orientation-lock');
});

test('sandbox.toggle should add a value that is not present already', (t) => {
  const { element } = t.context;

  element.sandbox.toggle('allow-forms');
  t.is(element.sandbox.value, 'allow-forms');
  t.is(element.getAttribute('sandbox'), 'allow-forms');
});

test('sandbox.toggle should remove a value that is present already', (t) => {
  const { element } = t.context;

  element.sandbox.value = 'allow-forms';
  element.sandbox.toggle('allow-forms');
  t.is(element.sandbox.value, '');
  t.is(element.getAttribute('sandbox'), '');
});
