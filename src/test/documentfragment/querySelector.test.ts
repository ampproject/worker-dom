import anyTest, { TestInterface } from 'ava';
import { createTestingDocument } from '../DocumentCreation';
import { DocumentFragment } from '../../worker-thread/dom/DocumentFragment';
import { Element } from '../../worker-thread/dom/Element';

const PARENT_DIV_ID = 'PARENT_DIV_ID';
const PARENT_DIV_CLASS = 'PARENT_DIV_CLASS';
const DIV_ID = 'DIV_ID';
const DIV_CLASS = 'DIV_CLASS';

const test = anyTest as TestInterface<{
  parentFragment: DocumentFragment;
  parentDiv: Element;
  div: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const parentFragment = document.createDocumentFragment();
  const parentDiv = document.createElement('div');
  parentDiv.setAttribute('id', PARENT_DIV_ID);
  parentDiv.setAttribute('class', PARENT_DIV_CLASS);
  const div = document.createElement('div');
  div.setAttribute('id', DIV_ID);
  div.setAttribute('class', DIV_CLASS);
  parentDiv.appendChild(div);
  parentFragment.appendChild(parentDiv);

  t.context = {
    parentFragment,
    parentDiv,
    div,
  };
});

test('test Element.querySelector on id selectors', (t) => {
  const { parentFragment, div } = t.context;

  t.deepEqual(parentFragment.querySelector(`#${DIV_ID}`), div);
});

test('test Element.querySelector on class selectors', (t) => {
  const { parentFragment, div } = t.context;

  t.deepEqual(parentFragment.querySelector(`.${DIV_CLASS}`), div);
});

test('test Element.querySelector on tag selectors', (t) => {
  const { parentFragment, parentDiv, div } = t.context;

  t.deepEqual(parentFragment.querySelector('div'), parentDiv);
  t.deepEqual(parentDiv.querySelector('div'), div);
});

test('test Element.querySelector is case insensitive with regards to tags', (t) => {
  const { parentFragment, parentDiv, div } = t.context;

  t.deepEqual(parentFragment.querySelector('div'), parentDiv);
  t.deepEqual(parentDiv.querySelector('div'), div);
  t.deepEqual(parentFragment.querySelector('DIV'), parentDiv);
  t.deepEqual(parentDiv.querySelector('DIV'), div);

  t.deepEqual(parentFragment.querySelector('div'), parentFragment.querySelector('DIV'));
  t.deepEqual(parentDiv.querySelector('div'), parentDiv.querySelector('DIV'));
});
