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
import { createDocument } from '../../worker-thread/dom/Document';

test('returns the name of the Node', t => {
  const document = createDocument();
  const node = document.createTextNode('');
  const nodeTwo = document.createElement('div');

  t.is(document.nodeName, '#document', 'document node returns a valid document node name');
  t.is(node.nodeName, '#text', 'text node returns a valid text node name');
  t.is(nodeTwo.nodeName, 'div', 'standard element node returns a valid node name');
});
