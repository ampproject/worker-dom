import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { Text } from '../../worker-thread/dom/Text';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  element: Element;
  child: Element;
  text: Text;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('div'),
    child: document.createElement('p'),
    text: document.createTextNode('default text'),
  };
});

test('textContent setter adds a child text node to Element.', (t) => {
  const { element } = t.context;

  t.is(element.childNodes.length, 0);
  element.textContent = 'foo';
  t.is(element.childNodes.length, 1);
});

test('clearing textContent via setter removes value stored as text inside element', (t) => {
  const { element, text } = t.context;

  element.appendChild(text);
  t.is(element.childNodes[0].data, 'default text');

  element.textContent = '';
  t.is(element.childNodes[0].data, '');
});

test('textContent setter replaces childNodes with single text node.', (t) => {
  const { element, child, text } = t.context;

  child.appendChild(text);
  element.appendChild(child);
  t.deepEqual(element.childNodes, [child]);
  t.is(element.childNodes[0].childNodes[0].data, 'default text');

  element.textContent = 'foo';
  t.is(element.childNodes.length, 1);
  t.is(element.childNodes[0].data, 'foo');
});
