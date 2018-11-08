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

import test from 'ava';
import { HTMLInputElement } from '../../worker-thread/dom/HTMLInputElement';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';

test.beforeEach(t => {
  t.context = {
    element: new HTMLInputElement(NodeType.ELEMENT_NODE, 'input', HTML_NAMESPACE),
  };
});

test('value', t => {
  const input = t.context.element as HTMLInputElement;

  t.is(input.value, '', 'Default value should be empty string.');

  input.value = 'abc';
  t.is(input.value, 'abc');

  input.value = true as any;
  t.is(input.value, 'true');

  input.value = 123 as any;
  t.is(input.value, '123');
});

test('valueAsNumber', t => {
  const input = t.context.element as HTMLInputElement;

  t.is(input.valueAsNumber, NaN, 'Default valueAsNumber should be NaN.');

  input.valueAsNumber = 123;
  t.is(input.value, '123');
  t.is(input.valueAsNumber, 123);

  input.valueAsNumber = 'notANumber' as any;
  t.is(input.value, '');
  t.is(input.valueAsNumber, NaN);
});

test('valueAsDate', t => {
  const input = t.context.element as HTMLInputElement;

  t.is(input.valueAsDate, null, 'Default valueAsDate should be null.');

  input.valueAsDate = new Date(2018, 0, 30);
  t.is(input.value, '2018-01-31');

  const d = input.valueAsDate;
  t.is(d.getFullYear(), 2018);
  t.is(d.getMonth(), 0);
  t.is(d.getDate(), 30);

  const error = t.throws(() => {
    input.valueAsDate = 'notADate' as any;
  }, TypeError);
  t.is(error.message, 'The provided value is not a Date.');
});

test('checked', t => {
  const input = t.context.element as HTMLInputElement;

  t.false(input.checked, 'Default checked should be false.');

  input.checked = true;
  t.true(input.checked);

  input.checked = false;
  t.false(input.checked);

  input.checked = 1 as any;
  t.true(input.checked);

  input.checked = null as any;
  t.false(input.checked);

  input.checked = 'abc' as any;
  t.true(input.checked);

  input.checked = '' as any;
  t.false(input.checked);
});
