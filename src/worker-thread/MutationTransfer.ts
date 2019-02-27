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

import { consume as consumeNodes } from './nodes';
import { consume as consumeStrings } from './strings';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Node } from './dom/Node';
import { phase, Phases } from '../transfer/phase';

export function transfer(postMessage: (message: any, transfer?: Transferable[]) => void, mutation: ArrayBuffer): void {
  console.log('transfer called', phase, [Phases.Initializing, Phases.Hydrating, Phases.Mutating]);
  if (phase !== Phases.Initializing) {
    console.log('allow transfer');
    const nodes = new Uint16Array(consumeNodes().reduce((acc: Array<number>, node: Node) => acc.concat(node[TransferrableKeys.creationFormat]), []))
      .buffer;

    postMessage(
      {
        nodes,
        strings: consumeStrings(),
        mutation,
      },
      [nodes, mutation],
    );
  }
}
