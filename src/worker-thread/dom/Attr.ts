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

import { keyValueString } from '../../utils';
import { NamespaceURI } from './Node';

export interface Attr {
  [index: string]: string | null;
  namespaceURI: NamespaceURI;
  name: string;
  value: string;
}

export const toString = (attributes: Attr[]): string => attributes.map((attr: Attr) => keyValueString(attr.name, attr.value)).join(' ');
export const matchPredicate = (namespaceURI: NamespaceURI, name: string): ((attr: Attr) => boolean) => (attr) =>
  attr.namespaceURI === namespaceURI && attr.name === name;
