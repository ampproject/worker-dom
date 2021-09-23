import anyTest, { TestInterface } from 'ava';
import { Text } from '../../worker-thread/dom/Text';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  text: Text;
  element: Element;
  paragraph: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    text: document.createTextNode('default value'),
    element: document.createElement('div'),
    paragraph: document.createElement('p'),
  };
});

test('unmounted text splitting', (t) => {
  const { text } = t.context;

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, null);
  t.is(offsetNode.previousSibling, null);
});

test('tree mounted text splitting', (t) => {
  const { text, element } = t.context;

  element.appendChild(text);

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, element);
  t.is(offsetNode.previousSibling, text);
});

test('tree with siblings mounted text splitting', (t) => {
  const { text, element, paragraph } = t.context;

  element.appendChild(text);
  element.appendChild(paragraph);

  const offsetNode: Text = text.splitText(3);
  t.is(text.textContent, 'def');
  t.is(offsetNode.textContent, 'ault value');
  t.is(text.parentNode, element);
  t.is(offsetNode.previousSibling, text);
  t.is(paragraph.previousSibling, offsetNode);
});
