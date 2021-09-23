import test from 'ava';
import { HTMLFieldSetElement } from '../../worker-thread/dom/HTMLFieldSetElement';
import { createTestingDocument } from '../DocumentCreation';

test('type should be fieldset by default', (t) => {
  const document = createTestingDocument();
  const element = document.createElement('fieldset') as HTMLFieldSetElement;

  t.is(element.type, 'fieldset');
});
