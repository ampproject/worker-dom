/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import anyTest, { TestInterface } from 'ava';
import { PropertyPair } from '../worker-thread/dom/enhanceElement';
import { Element } from '../worker-thread/dom/Element';

const test = anyTest as TestInterface<{
  element: Element;
}>;

export function testReflectedProperties(propertyPairs: Array<PropertyPair>) {
  propertyPairs.forEach(pair => {
    testReflectedProperty(pair);
  });
}

export function testReflectedProperty(propertyPair: PropertyPair, overrideValueToTest: string | boolean | number | null = null) {
  const propertyName = Object.keys(propertyPair)[0];
  const defaultValue = propertyPair[propertyName][0];
  const attributeName = propertyPair[propertyName][1] || propertyName.toLowerCase();
  const keywords = propertyPair[propertyName][2];
  const valueToTest = deriveValueToTest(overrideValueToTest !== null ? overrideValueToTest : defaultValue);

  test(`${propertyName} should be ${defaultValue} by default`, t => {
    const { element } = t.context;
    t.is(element[propertyName], defaultValue);
  });

  test(`${propertyName} should be settable to a single value`, t => {
    const { element } = t.context;
    element[propertyName] = valueToTest;
    t.is(element[propertyName], valueToTest);
  });

  test(`${propertyName} property change should be reflected in attribute`, t => {
    const { element } = t.context;
    element[propertyName] = valueToTest;
    if (keywords) {
      // Enumerated attrs have keywords instead of 'true' and 'false', e.g. translate="yes|no".
      const keyword = valueToTest ? keywords[0] : keywords[1];
      t.is(element.getAttribute(attributeName), keyword);
    } else if (typeof valueToTest === 'boolean') {
      // Boolean attributes only care about existence of the attribute, not their values.
      t.is(element.hasAttribute(attributeName), valueToTest);
    } else {
      t.is(element.getAttribute(attributeName), String(valueToTest));
    }
  });

  test(`${propertyName} attribute change should be reflected in property`, t => {
    const { element } = t.context;
    element.setAttribute(attributeName, String(valueToTest));
    t.is(element[propertyName], valueToTest);
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
