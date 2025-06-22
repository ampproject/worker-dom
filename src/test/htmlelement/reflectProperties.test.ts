import anyTest, { TestFn } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper.js';
import { createTestingDocument } from '../DocumentCreation.js';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement.js';

const test = anyTest as TestFn<{
  element: HTMLElement;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    element: document.createElement('div') as HTMLElement,
  };
});

testReflectedProperties([
  { accessKey: [''] },
  { contentEditable: ['inherit'] },
  { dir: [''] },
  { lang: [''] },
  { title: [''] },
  { draggable: [false] },
  { hidden: [false] },
  { noModule: [false] },
  {
    spellcheck: [true, /* attr */ undefined, /* keywords */ ['true', 'false']],
  },
  { translate: [true, /* attr */ undefined, /* keywords */ ['yes', 'no']] },
]);
