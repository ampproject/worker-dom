import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const PARENT_DIV_ID = 'PARENT_DIV_ID';
const PARENT_DIV_CLASS = 'PARENT_DIV_CLASS';
const DIV_ID = 'DIV_ID';
const DIV_CLASS = 'DIV_CLASS';

const test = anyTest as TestInterface<{
  document: Document;
  parentDiv: Element;
  div: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const parentDiv = document.createElement('div');
  parentDiv.setAttribute('id', PARENT_DIV_ID);
  parentDiv.setAttribute('class', PARENT_DIV_CLASS);
  const div = document.createElement('div');
  div.setAttribute('id', DIV_ID);
  div.setAttribute('class', DIV_CLASS);
  parentDiv.appendChild(div);
  document.body.appendChild(parentDiv);

  t.context = {
    document,
    parentDiv,
    div,
  };
});

test('test Element.querySelector on id selectors', (t) => {
  const { document, div } = t.context;

  t.deepEqual(document.querySelector(`#${DIV_ID}`), div);
});

test('test Element.querySelector on class selectors', (t) => {
  const { document, div } = t.context;

  t.deepEqual(document.querySelector(`.${DIV_CLASS}`), div);
});

test('test Element.querySelector on tag selectors', (t) => {
  const { document, parentDiv, div } = t.context;

  t.deepEqual(document.querySelector('div'), parentDiv);
  t.deepEqual(document.querySelector('div'), document.body.querySelector('div'));
  t.deepEqual(parentDiv.querySelector('div'), div);
});

test('test Element.querySelector is case insensitive with regards to tags', (t) => {
  const { document, parentDiv, div } = t.context;

  t.deepEqual(document.querySelector('div'), parentDiv);
  t.deepEqual(parentDiv.querySelector('div'), div);
  t.deepEqual(document.querySelector('DIV'), parentDiv);
  t.deepEqual(parentDiv.querySelector('DIV'), div);

  t.deepEqual(document.querySelector('div'), document.querySelector('DIV'));
  t.deepEqual(parentDiv.querySelector('div'), parentDiv.querySelector('DIV'));
});
