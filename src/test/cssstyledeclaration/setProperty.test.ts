import anyTest, { TestFn } from 'ava';
import { CSSStyleDeclaration, appendKeys } from '../../worker-thread/css/CSSStyleDeclaration.js';
import { Element } from '../../worker-thread/dom/Element.js';
import { createTestingDocument } from '../DocumentCreation.js';

const test = anyTest as TestFn<{
  node: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    node: document.createElement('div'),
  };
});

test('setting a value stores the value for a getter', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  t.true(declaration.width === undefined);
  appendKeys(['width']);
  declaration.width = '10px';
  t.is(declaration.width, '10px');
});
