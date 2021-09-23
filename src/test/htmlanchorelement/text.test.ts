import anyTest, { TestInterface } from 'ava';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement';
import { Text } from '../../worker-thread/dom/Text';
import { createTestingDocument } from '../DocumentCreation';
import { Element } from '../../worker-thread/dom/Element';

const test = anyTest as TestInterface<{
  element: HTMLAnchorElement;
  child: Element;
  text: Text;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('a') as HTMLAnchorElement,
    child: document.createElement('p'),
    text: document.createTextNode('default text'),
  };
});

test('text setter adds a child text node to HTMLAnchorElement.', (t) => {
  const { element } = t.context;

  t.is(element.childNodes.length, 0);
  element.text = 'foo';
  t.is(element.childNodes.length, 1);
});

test('clearing text via setter removes value stored as text inside element', (t) => {
  const { element, text } = t.context;

  element.appendChild(text);
  t.is(element.childNodes[0].data, 'default text');

  element.text = '';
  t.is(element.childNodes[0].data, '');
});

test('text setter replaces childNodes with single text node.', (t) => {
  const { element, child, text } = t.context;

  child.appendChild(text);
  element.appendChild(child);
  t.deepEqual(element.childNodes, [child]);
  t.is(element.childNodes[0].childNodes[0].data, 'default text');

  element.text = 'foo';
  t.is(element.childNodes.length, 1);
  t.is(element.childNodes[0].data, 'foo');
});
