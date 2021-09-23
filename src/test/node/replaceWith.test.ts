import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  parent: Element;
  child: Element;
  childTwo: Element;
  childThree: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    parent: document.createElement('div'),
    child: document.createElement('div'),
    childTwo: document.createElement('div'),
    childThree: document.createElement('div'),
  };
});

test('replacing with no values provided removes child from parent', (t) => {
  const { parent, child } = t.context;

  parent.appendChild(child);
  t.is(child.parentNode, parent, 'before replacement parentNode exists');

  child.replaceWith();
  t.is(child.parentNode, null, 'after replacement parentNode is unset');
  t.deepEqual(parent.childNodes, []);
});

test('replacing unattached child results in no changes', (t) => {
  const { child, childTwo } = t.context;

  t.is(child.parentNode, null, 'before replacement parentNode does not exist');

  child.replaceWith(childTwo);
  t.is(child.parentNode, null, 'after replacement original child parentNode remains unset');
  t.is(childTwo.parentNode, null, 'after replacement new child parentNode remains unset');
});

test('replacing the same child results in no changes', (t) => {
  const { parent, child } = t.context;

  parent.appendChild(child);
  t.is(child.parentNode, parent, 'before replacement parentNode exists');

  child.replaceWith(child);
  t.is(child.parentNode, parent, 'after replacement parentNode remains correct');
  t.deepEqual(parent.childNodes, [child]);
});

test('replacing a child with another when there is only a single child', (t) => {
  const { parent, child, childTwo } = t.context;

  parent.appendChild(child);
  t.is(child.parentNode, parent);
  t.is(childTwo.parentNode, null);

  child.replaceWith(childTwo);
  t.is(child.parentNode, null);
  t.is(childTwo.parentNode, parent);
  t.deepEqual(parent.childNodes, [childTwo]);
});

test('replacing a single child with a multiple children', (t) => {
  const { parent, child, childTwo, childThree } = t.context;

  parent.appendChild(child);
  t.is(child.parentNode, parent);

  child.replaceWith(childTwo, childThree);
  t.is(child.parentNode, null);
  t.is(childTwo.parentNode, parent);
  t.is(childThree.parentNode, parent);
  t.deepEqual(parent.childNodes, [childTwo, childThree]);
});

test('replacing a single child with a text element', (t) => {
  const { document, parent, child } = t.context;
  const textElement = document.createTextNode('text value');

  parent.appendChild(child);
  t.is(child.parentNode, parent);

  child.replaceWith(textElement);
  t.is(child.parentNode, null);
  t.is(textElement.parentNode, parent);
  t.deepEqual(parent.childNodes, [textElement]);
});

test('replacing a single child with an auto-coersed text value', (t) => {
  const { parent, child } = t.context;

  parent.appendChild(child);
  t.is(child.parentNode, parent);

  child.replaceWith('text value');
  t.is(child.parentNode, null);
  t.is(parent.childNodes.length, 1);
  t.is(parent.childNodes[0].textContent, 'text value');
});

test('replacing a single child with a mix of elements and auto-coersed text value', (t) => {
  const { parent, child, childTwo } = t.context;

  parent.appendChild(child);
  t.is(child.parentNode, parent);

  child.replaceWith(childTwo, 'text value');
  t.is(child.parentNode, null);
  t.is(parent.childNodes.length, 2);
  t.is(parent.childNodes[0], childTwo);
  t.is(parent.childNodes[1].textContent, 'text value');
});
