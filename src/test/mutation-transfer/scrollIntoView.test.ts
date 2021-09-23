import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { createTestingDocument } from '../DocumentCreation';
import { expectMutations } from '../Emitter';
import { Element } from '../../worker-thread/dom/Element';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{
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

test.serial.cb('Element.scrollIntoView() transfer to main-thread', (t) => {
  const { document, element } = t.context;
  element.isConnected = true;

  expectMutations(document, (mutations) => {
    t.deepEqual(mutations, [TransferrableMutationType.SCROLL_INTO_VIEW, element[TransferrableKeys.index]]);
    t.end();
  });

  element.scrollIntoView();
});
