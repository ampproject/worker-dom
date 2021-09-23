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

test('removing a value stored eliminates the stored value', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['width']);
  declaration.width = '10px';
  t.is(declaration.width, '10px');
  declaration.removeProperty('width');
  t.is(declaration.width, '');
});

test('removing a value stored returns the previously stored value', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  appendKeys(['width']);
  declaration.width = '10px';
  const oldValue = declaration.removeProperty('width');
  t.is(oldValue, '10px');
});
