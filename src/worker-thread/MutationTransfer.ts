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
import { MessageType } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Node } from './dom/Node';
import { Phase } from '../transfer/Phase';
import { phase, set as setPhase } from './phase';
import { PostMessage } from './worker-thread';

let allowTransfer = false;
let pending = false;
let pendingMutations: Array<number> = [];

export function transfer(postMessage: PostMessage, mutation: Array<number>): void {
  if (phase > Phase.Hydrating) {
    pending = true;
    pendingMutations = pendingMutations.concat(mutation);

    if (allowTransfer) {
      Promise.resolve().then(_ => {
        if (pending) {
          const nodes = new Uint16Array(
            consumeNodes().reduce((acc: Array<number>, node: Node) => acc.concat(node[TransferrableKeys.creationFormat]), []),
          ).buffer;
          const mutations = new Uint16Array(pendingMutations).buffer;

          postMessage(
            {
              [TransferrableKeys.type]: MessageType.MUTATE,
              [TransferrableKeys.nodes]: nodes,
              [TransferrableKeys.strings]: consumeStrings(),
              [TransferrableKeys.mutations]: mutations,
            },
            [nodes, mutations],
          );

          pendingMutations = [];
          pending = false;
        }
      });
    }
  }
}

export function observe(): void {
  allowTransfer = true;
  setPhase(Phase.Mutating);
}
