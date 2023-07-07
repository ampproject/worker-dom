import anyTest, { TestInterface } from 'ava';
import { Element } from '../worker-thread/dom/Element';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{
  element: Element;
}>;

export function testReflectedListenableProperty(
  properties: {
    [key: string]: any;
  },
  overrideValueToTest: string | boolean | number | null = null,
) {
  Object.keys(properties).forEach((propertyName) => {
    const defaultValue = properties[propertyName];
    const valueToTest = deriveValueToTest(overrideValueToTest !== null ? overrideValueToTest : defaultValue);

    test(`${propertyName} should be ${defaultValue} by default`, (t) => {
      const { element } = t.context;
      t.is(element[propertyName], defaultValue);
    });

    test(`${propertyName} should be settable to a single value`, (t) => {
      const { element } = t.context;
      element[propertyName] = valueToTest;
      t.is(element[propertyName], valueToTest);
    });

    test(`${propertyName} property should be listed in [TransferrableKeys.listenableProperties]`, (t) => {
      const { element } = t.context;
      t.true(element[TransferrableKeys.listenableProperties].includes(propertyName));
    });
  });
}

function deriveValueToTest(valueToTest: string | boolean | number): string | boolean | number {
  switch (typeof valueToTest) {
    case 'string':
      return `alt-${valueToTest || ''}`;
    case 'boolean':
      return !valueToTest;
    case 'number':
      return Number(valueToTest) + 1;
    default:
      return valueToTest;
  }
}
