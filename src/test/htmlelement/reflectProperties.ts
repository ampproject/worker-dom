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
import { testReflectedProperties } from '../reflectPropertiesHelper';
import { HTMLElement } from '../../worker-thread/dom/HTMLElement';
import { NodeType, HTML_NAMESPACE } from '../../transfer/TransferrableNodes';

test.beforeEach(t => {
  t.context = {
    element: new HTMLElement(NodeType.ELEMENT_NODE, 'div', HTML_NAMESPACE),
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
  { spellcheck: [true, /* attr */ undefined, /* keywords */ ['true', 'false']] },
  { translate: [true, /* attr */ undefined, /* keywords */ ['yes', 'no']] },
]);
