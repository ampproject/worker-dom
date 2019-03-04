import anyTest, { TestInterface } from 'ava';
import { Document, createDocument } from '../../worker-thread/dom/Document';
import { HTMLInputElement } from '../../worker-thread/dom/HTMLInputElement';

const test = anyTest as TestInterface<{
  document: Document;
}>;

test.beforeEach(t => {
  const document = createDocument();
  t.context = { document };
});

// Tests case-sensitivity of registerSubclass() (#155).
test('"input" should instantiate HTMLInputElement', t => {
  const { document } = t.context;

  let input = document.createElement('input');
  t.true(input instanceof HTMLInputElement);

  input = document.createElement('INPUT');
  t.true(input instanceof HTMLInputElement);
});
