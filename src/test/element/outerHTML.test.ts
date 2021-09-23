import anyTest, { TestInterface } from 'ava';
import { Element } from '../../worker-thread/dom/Element';
import { Document } from '../../worker-thread/dom/Document';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  node: Element;
  child: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    node: document.createElement('div'),
    child: document.createElement('div'),
  };
});

test('element with no children', (t) => {
  const { node } = t.context;

  t.is(node.outerHTML, '<div></div>');
  node.className = 'test';
  t.is(node.outerHTML, '<div class="test"></div>');
});

test('element with a child', (t) => {
  const { node, child } = t.context;

  node.appendChild(child);
  t.is(node.outerHTML, '<div><div></div></div>');
});

test('void elements without children', (t) => {
  const { document } = t.context;

  t.is(document.createElement('area').outerHTML, '<area>');
  t.is(document.createElement('base').outerHTML, '<base>');
  t.is(document.createElement('br').outerHTML, '<br>');
  t.is(document.createElement('col').outerHTML, '<col>');
  t.is(document.createElement('embed').outerHTML, '<embed>');
  t.is(document.createElement('hr').outerHTML, '<hr>');
  t.is(document.createElement('img').outerHTML, '<img>');
  t.is(document.createElement('input').outerHTML, '<input>');
  t.is(document.createElement('link').outerHTML, '<link>');
  t.is(document.createElement('meta').outerHTML, '<meta>');
  t.is(document.createElement('param').outerHTML, '<param>');
  t.is(document.createElement('source').outerHTML, '<source>');
  t.is(document.createElement('track').outerHTML, '<track>');
  t.is(document.createElement('wbr').outerHTML, '<wbr>');
});

test('void elements with children', (t) => {
  const { document, child } = t.context;

  const input = document.createElement('input');
  t.is(input.outerHTML, '<input>');

  input.appendChild(child);
  t.is(input.outerHTML, '<input><div></div></input>');
});
