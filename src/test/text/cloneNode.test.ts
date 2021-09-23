import anyTest, { TestInterface } from 'ava';
import { createTestingDocument } from '../DocumentCreation';
import { Element } from '../../worker-thread/dom/Element';
import { Text } from '../../worker-thread/dom/Text';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{
  parent: Element;
  text: Text;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    parent: document.createElement('div'),
    text: document.createTextNode('dogs are the best'),
  };

  t.context.parent.appendChild(t.context.text);
  document.body.appendChild(t.context.parent);
});

test('cloneNode should create a new node with the same tagName', (t) => {
  const { text } = t.context;

  t.is(text.cloneNode().tagName, text.tagName);
});

test('cloneNode should create a new node with a different index', (t) => {
  const { text } = t.context;

  t.not(text.cloneNode()[TransferrableKeys.index], text[TransferrableKeys.index]);
});

test('cloneNode should create a new node with the same children when the deep flag is set', (t) => {
  const { parent, text } = t.context;
  const clone = parent.cloneNode(true);

  t.is(parent.childNodes.length, clone.childNodes.length);
  t.is(text.tagName, clone.childNodes[0].tagName);
  t.is(text.textContent, clone.childNodes[0].textContent);
});
