import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { SVGElement } from '../../worker-thread/dom/SVGElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  t.context = { document };
});

test('createElement(x) should lowercase x', (t) => {
  const { document } = t.context;

  let el = document.createElement('div');
  t.is(el.nodeName, 'DIV');
  t.is(el.localName, 'div');

  el = document.createElement('DIV');
  t.is(el.nodeName, 'DIV');
  t.is(el.localName, 'div');

  el = document.createElement('SvG');
  t.is(el.nodeName, 'SVG');
  t.is(el.localName, 'svg');
  t.false(el instanceof SVGElement);
});

test('createElement() should use HTML namespace', (t) => {
  const { document } = t.context;

  let el = document.createElement('div');
  t.is(el.namespaceURI, 'http://www.w3.org/1999/xhtml');

  el = document.createElement('svg');
  t.is(el.namespaceURI, 'http://www.w3.org/1999/xhtml');
});

test('createElementNS(ns, x) should not lowercase x', (t) => {
  const { document } = t.context;

  let el = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  t.is(el.nodeName, 'DIV');
  t.is(el.localName, 'div');

  el = document.createElementNS('http://www.w3.org/1999/xhtml', 'DIV');
  t.is(el.nodeName, 'DIV');
  t.is(el.localName, 'DIV');

  el = document.createElementNS('http://www.w3.org/2000/svg', 'SvG');
  t.is(el.nodeName, 'SVG');
  t.is(el.localName, 'SvG');
  t.false(el instanceof SVGElement);

  el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  t.is(el.nodeName, 'svg');
  t.is(el.localName, 'svg');
  t.true(el instanceof SVGElement);
});
