import anyTest, { TestFn } from 'ava';
import { CSSStyleDeclaration, appendKeys } from '../../worker-thread/css/CSSStyleDeclaration.js';
import { Element } from '../../worker-thread/dom/Element.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';

const test = anyTest as TestFn<{
  node: Element;
  declaration: CSSStyleDeclaration;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
    declaration: new CSSStyleDeclaration(document.createElement('div')),
  };
});

test.serial('appending keys mutates a declaration instance', (t) => {
  const { declaration } = t.context;

  t.true(declaration.width === undefined);
  appendKeys(['width']);
  t.is(declaration.width, '');
});

test.serial('previously appended keys should exist on newly declared instances', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  t.is(declaration.width, '');
});

test('invalid keys are filtered', (t) => {
  const initialLength = CSSStyleDeclaration.prototype.length;

  appendKeys(['0']);
  t.is(CSSStyleDeclaration.prototype.length, initialLength);
});

test('appending keys mutates all known declaration instances', (t) => {
  const firstDeclaration = new CSSStyleDeclaration(t.context.node);
  const secondDeclaration = new CSSStyleDeclaration(t.context.node);

  t.true(firstDeclaration.height === undefined);
  t.true(secondDeclaration.height === undefined);
  appendKeys(['height']);
  t.is(firstDeclaration.height, '');
  t.is(secondDeclaration.height, '');
});

test('reappending a key does not cause an error', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width']);
  appendKeys(['width']);

  t.is(declaration.width, '');
});

test('appending as many keys as there are TransferrableKeys functions', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);
  appendKeys(['width']);
  appendKeys(Array.from(Array(TransferrableKeys.END), (d, i) => i + 'key'));

  t.is(declaration.width, '');
  declaration.width = '40px';
  t.is(declaration.width, '40px');
});
