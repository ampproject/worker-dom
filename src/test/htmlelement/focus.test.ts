/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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
import * as sinon from 'sinon';
import { Document } from '../../worker-thread/dom/Document';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  document: Document;
  element: HTMLElement;
  sandbox: sinon.SinonSandbox;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();
  const element = document.createElement('input') as HTMLElement;
  document.body.appendChild(element);

  const sandbox = sinon.createSandbox();
  sandbox.spy(element, 'focus');
  t.context = {
    document,
    element,
    sandbox,
  };
});

test.afterEach((t) => {
  const { sandbox } = t.context;
  sandbox.restore();
});

test('focus should exist as a method on the element', (t) => {
  const { element } = t.context;

  t.is(typeof element.focus, 'function');
});

test.failing('focus should execute', (t) => {
  const { element } = t.context;

  element.focus();
  t.is(element.prototype.focus.calledOnce, true);
  /*
  var callback = sinon.fake();
  var proxy = once(callback);

    proxy();

    assert(callback.called);
  */

  // sinon.mock(element).expects("focus").atMost(1);
  // element.focus();
});

// test("focus should execute with option to preventScroll", (t) => {
//   const { element } = t.context;
//   t.plan(1);

//   element.addEventListener("focus", () => {
//     t.pass();
//   });
//   element.focus({ preventScroll: true });
// });

// test("focus should execute with option to preventScroll set to false", (t) => {
//   const { element } = t.context;
//   t.plan(1);

//   element.addEventListener("focus", () => {
//     t.pass();
//   });
//   element.focus({ preventScroll: false });
// });
