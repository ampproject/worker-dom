import anyTest, { TestInterface } from 'ava';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{}>;

test('HTMLElement.click() can be programatically triggered', (t) => {
  const doc = createTestingDocument();
  const input = doc.createElement('input');

  let resolve: Function;
  let promise: Promise<void> = new Promise((res) => (resolve = res));

  input.addEventListener('click', () => {
    t.pass();
    resolve();
  });
  input.click();

  return promise;
});
