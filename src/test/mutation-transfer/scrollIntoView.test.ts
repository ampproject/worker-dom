import anyTest, { TestFn } from 'ava';
import { Document } from '../../worker-thread/dom/Document.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { expectMutations } from '../Emitter.js';
import { Element } from '../../worker-thread/dom/Element.js';
import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';

const test = anyTest as TestFn<{
  document: Document;
  element: Element;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const element = document.createElement('div');

  t.context = {
    document,
    element,
  };
});

test.serial('Element.scrollIntoView() transfer to main-thread', async (t) => {
  const { document, element } = t.context;
  element.isConnected = true;

  return new Promise<void>((resolve) => {
    expectMutations(document, (mutations) => {
      t.deepEqual(mutations, [TransferrableMutationType.SCROLL_INTO_VIEW, element[TransferrableKeys.index]]);
      resolve();
    });

    element.scrollIntoView();
  });
});
