import anyTest, { TestInterface } from 'ava';
import { HTMLOptionElement } from '../../worker-thread/dom/HTMLOptionElement';
import { createTestingDocument } from '../DocumentCreation';
import { Text } from '../../worker-thread/dom/Text';

const test = anyTest as TestInterface<{
  option: HTMLOptionElement;
  text: Text;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    option: document.createElement('option') as HTMLOptionElement,
    text: document.createTextNode('sample text'),
  };
});

test('label should be Node.textContent by default', (t) => {
  const { option, text } = t.context;

  t.is(option.label, '');
  option.appendChild(text);
  t.is(option.label, 'sample text');
});

test('label is reflected from attribute when present', (t) => {
  const { option, text } = t.context;

  option.setAttribute('label', 'label attribute');
  t.is(option.label, 'label attribute');
  option.appendChild(text);
  t.is(option.label, 'label attribute');
});

test('label is Node.textContent when attribute is removed', (t) => {
  const { option, text } = t.context;

  option.setAttribute('label', 'label attribute');
  t.is(option.label, 'label attribute');
  option.appendChild(text);
  option.removeAttribute('label');
  t.is(option.label, 'sample text');
});
