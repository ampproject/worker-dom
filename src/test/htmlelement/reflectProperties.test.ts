import anyTest, { TestInterface } from 'ava';
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { createTestingDocument } from '../DocumentCreation';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';

const test = anyTest as TestInterface<{
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
