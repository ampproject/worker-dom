import anyTest, { TestInterface } from 'ava';
import { createTestingDocument } from '../DocumentCreation';
import { Element } from '../../worker-thread/dom/Element';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { Text } from '../../worker-thread/dom/Text';
import { Document } from '../../worker-thread/dom/Document';
import { HTMLAnchorElement } from '../../worker-thread/dom/HTMLAnchorElement';

const test = anyTest as TestInterface<{
  parent: Element;
  child: Element;
  text: Text;
  sibling: Element;
  document: Document;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    parent: document.createElement('div'),
    child: document.createElement('p'),
    text: document.createTextNode('text'),
    sibling: document.createElement('aside'),
    document,
  };

  t.context.child.appendChild(t.context.text);
  t.context.parent.appendChild(t.context.child);
  t.context.parent.appendChild(t.context.sibling);
  document.body.appendChild(t.context.parent);
});

test('cloneNode should create a new node with the same tagName', (t) => {
  const { parent } = t.context;

  t.is(parent.cloneNode().tagName, parent.tagName);
});

test('cloneNode should create a new node with the same nodeName', (t) => {
  const { parent } = t.context;

  t.is(parent.cloneNode().nodeName, parent.nodeName);
});

test('cloneNode should create a new node with a different index', (t) => {
  const { parent } = t.context;

  t.not(parent.cloneNode()[TransferrableKeys.index], parent[TransferrableKeys.index]);
});

test('cloneNode should create a new node with the same attribute', (t) => {
  const { parent } = t.context;
  parent.setAttribute('fancy', 'yes');

  t.is(parent.cloneNode().getAttribute('fancy'), 'yes');
});

test('cloneNode should create a new node with the same attributes', (t) => {
  const { parent } = t.context;
  parent.setAttribute('fancy', 'yes');
  parent.setAttribute('virtual', 'no');

  t.is(parent.cloneNode().getAttribute('fancy'), 'yes');
  t.is(parent.cloneNode().getAttribute('virtual'), 'no');
});

test('cloneNode should create a new node with the same attributes, but not preserve attributes across the instances', (t) => {
  const { parent } = t.context;
  parent.setAttribute('fancy', 'yes');
  const clone = parent.cloneNode();
  parent.setAttribute('fancy', 'no');

  t.is(clone.getAttribute('fancy'), 'yes');
  t.is(parent.getAttribute('fancy'), 'no');
});

test('cloneNode should create a new node without the same properties', (t) => {
  const { parent } = t.context;
  parent.value = 'property value';

  t.not(parent.cloneNode().value, 'property value');
});

test('cloneNode should create a new node without the same children when the deep flag is not set', (t) => {
  const { parent } = t.context;
  const clone = parent.cloneNode();

  t.is(clone.childNodes.length, 0);
});

test('cloneNode should create a new node with the same children when the deep flag is set', (t) => {
  const { parent } = t.context;
  const clone = parent.cloneNode(true);

  t.is(parent.childNodes.length, clone.childNodes.length);
  t.is(parent.childNodes[0].tagName, clone.childNodes[0].tagName);
  t.is(parent.childNodes[0].childNodes[0].textContent, clone.childNodes[0].childNodes[0].textContent);
});

test('cloneNode should return a new instance of the the same type as the input', (t) => {
  const { document } = t.context;
  const element = document.createElement('a');
  const clone = element.cloneNode();

  t.true(clone instanceof HTMLAnchorElement);
});
