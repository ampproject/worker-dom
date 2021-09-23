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

test('setting a value stores the value for a getter', (t) => {
  const declaration = new CSSStyleDeclaration(t.context.node);

  t.is(declaration.width, undefined);
  appendKeys(['width']);
  declaration.width = '10px';
  t.is(declaration.width, '10px');
});
