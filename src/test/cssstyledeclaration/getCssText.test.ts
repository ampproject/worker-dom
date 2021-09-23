import anyTest, { TestInterface } from 'ava';
import { CSSStyleDeclaration, appendKeys } from '../../worker-thread/css/CSSStyleDeclaration';
import { Element } from '../../worker-thread/dom/Element';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  node: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
  };
});

test('cssText is empty by default', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  t.is(declaration.cssText, '');
});

test('cssText contains single mutated property', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['width']);
  declaration.width = '100px';
  t.is(declaration.cssText, 'width: 100px;');
});

test('cssText hyphenates only capitals after lowercase letters', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['linebreakFoo']);
  declaration.linebreakFoo = 'normal';
  t.is(declaration.cssText, 'linebreak-foo: normal;');
});

test('cssText contains multiple mutated properties', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['height', 'position']);
  declaration.height = '100px';
  declaration.position = 'absolute';
  t.is(declaration.cssText, 'height: 100px; position: absolute;');
});

test('cssText contains webkit vendor prefixed property', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['webkitLineBreak']);
  declaration.webkitLineBreak = 'normal';
  t.is(declaration.cssText, '-webkit-line-break: normal;');
});

test('cssText contains ms vendor prefixed property', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['msLineBreak']);
  declaration.msLineBreak = 'normal';
  t.is(declaration.cssText, '-ms-line-break: normal;');
});

test('cssText contains moz vendor prefixed propertiy', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['mozLineBreak']);
  declaration.mozLineBreak = 'normal';
  t.is(declaration.cssText, '-moz-line-break: normal;');
});

test('cssText contains khtml vendor prefixed propertiy', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['khtmlLineBreak']);
  declaration.khtmlLineBreak = 'normal';
  t.is(declaration.cssText, '-khtml-line-break: normal;');
});

test('cssText does not prefix hyphenated keys containing vendor prefixes not in the first position', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['lineKhtmlBreak']);
  declaration.lineKhtmlBreak = 'normal';
  t.is(declaration.cssText, 'line-khtml-break: normal;');
});
