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

test('setting cssText to empty from empty', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  t.is(declaration.cssText, '');
  declaration.cssText = '';
  t.is(declaration.cssText, '');
});

test('setting cssText to empty makes cssText empty', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width']);
  declaration.width = '10px';

  t.is(declaration.cssText, 'width: 10px;');
  declaration.cssText = '';
  t.is(declaration.cssText, '');
});

test('setting cssText to empty removes stored values', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width']);
  declaration.width = '10px';

  t.is(declaration.width, '10px');
  declaration.cssText = '';
  t.is(declaration.width, '');
});

test('setting cssText with a value stores the value', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width']);

  t.is(declaration.cssText, '');
  declaration.cssText = 'width: 10px;';
  t.is(declaration.width, '10px');
});

test('setting cssText with multiple values stores the values', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width', 'height']);

  t.is(declaration.cssText, '');
  declaration.cssText = 'width: 10px; height: 12px;';
  t.is(declaration.width, '10px');
  t.is(declaration.height, '12px');
});

test('setting cssText with a single value requiring key conversion', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['lineHeight']);

  t.is(declaration.cssText, '');
  declaration.cssText = 'line-height: 10px';
  t.is(declaration.lineHeight, '10px');
});

test('setting cssText with a single value requiring key conversion with vendor prefix', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['webkitLineHeight']);

  t.is(declaration.cssText, '');
  declaration.cssText = '-webkit-line-height: 10px';
  t.is(declaration.webkitLineHeight, '10px');
});

test('setting cssText with a single miscapitalized value requiring key conversion with vendor prefix', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['webkitLineHeight']);

  t.is(declaration.cssText, '');
  declaration.cssText = '-webkit-linE-height: 10px';
  t.is(declaration.webkitLineHeight, '10px');
});

test('setting cssText with a non-string should set empty string instead', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width']);
  t.is(declaration.cssText, '');

  declaration.cssText = 'width: 10px;';
  t.is(declaration.width, '10px');

  declaration.cssText = { width: '10px' } as any;
  t.is(declaration.cssText, '');
});
