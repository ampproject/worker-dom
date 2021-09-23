import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { HTMLDataListElement } from '../../worker-thread/dom/HTMLDataListElement';
import { Text } from '../../worker-thread/dom/Text';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: HTMLDataListElement;
  option: Element;
  optionTwo: Element;
  text: Text;
  invalidElement: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('datalist') as HTMLDataListElement,
    option: document.createElement('option'),
    optionTwo: document.createElement('option'),
    text: document.createTextNode(''),
    invalidElement: document.createElement('div'),
  };
});

test('options should be an empty array when there are no childNodes', (t) => {
  const { node } = t.context;

  t.is(node.options.length, 0);
  t.deepEqual(node.options, []);
});

test('options should contain all childNodes when all have the correct node name', (t) => {
  const { node, option, optionTwo } = t.context;

  node.appendChild(option);
  t.is(node.options.length, 1);
  node.appendChild(optionTwo);
  t.is(node.options.length, 2);
  t.deepEqual(node.options, [option, optionTwo]);
});

test('options should contain only childNodes of the correct node name', (t) => {
  const { node, option, optionTwo, text, invalidElement } = t.context;

  t.is(node.options.length, 0);
  node.appendChild(option);
  t.is(node.options.length, 1);
  node.appendChild(optionTwo);
  t.is(node.options.length, 2);
  node.appendChild(text);
  node.appendChild(invalidElement);
  t.is(node.options.length, 2);
  t.deepEqual(node.options, [option, optionTwo]);
});

test('options should be an empty array when there are no childNodes of correct node names', (t) => {
  const { node, invalidElement } = t.context;

  node.appendChild(invalidElement);
  t.is(node.options.length, 0);
  t.deepEqual(node.options, []);
});
