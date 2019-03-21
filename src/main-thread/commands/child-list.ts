/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import { ChildListMutationIndex } from '../../transfer/TransferrableMutation';
import { CommandExecutor } from './interface';
import { NodeContext } from '../nodes';

export function ChildListProcessor({ getNode }: NodeContext): CommandExecutor {
  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      const appendNodeCount = mutations[startPosition + ChildListMutationIndex.AppendedNodeCount];
      const removeNodeCount = mutations[startPosition + ChildListMutationIndex.RemovedNodeCount];
      if (removeNodeCount > 0) {
        mutations
          .slice(
            startPosition + ChildListMutationIndex.Nodes + appendNodeCount,
            startPosition + ChildListMutationIndex.Nodes + appendNodeCount + removeNodeCount,
          )
          .forEach(removeId => {
            const node = getNode(removeId);
            if (!node) {
              console.error(`getNode() yields null – ${removeId}`);
              return;
            }
            node.remove();
          });
      }
      if (appendNodeCount > 0) {
        mutations
          .slice(startPosition + ChildListMutationIndex.Nodes, startPosition + ChildListMutationIndex.Nodes + appendNodeCount)
          .forEach(addId => {
            const nextSibling = mutations[startPosition + ChildListMutationIndex.NextSibling];
            const newNode = getNode(addId);
            if (newNode) {
              // TODO: Handle this case ---
              // Transferred nodes that are not stored were previously removed by the sanitizer.
              target.insertBefore(newNode, (nextSibling && getNode(nextSibling)) || null);
            }
          });
      }
      return startPosition + ChildListMutationIndex.LastStaticNode + appendNodeCount + removeNodeCount + 1;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      const appendNodeCount = mutations[startPosition + ChildListMutationIndex.AppendedNodeCount];
      const removeNodeCount = mutations[startPosition + ChildListMutationIndex.RemovedNodeCount];
      const removedNodes = Array.from(
        mutations.slice(
          startPosition + ChildListMutationIndex.Nodes + appendNodeCount,
          startPosition + ChildListMutationIndex.Nodes + appendNodeCount + removeNodeCount,
        ),
      ).map(index => getNode(index) || index);
      const addedNodes = Array.from(
        mutations.slice(startPosition + ChildListMutationIndex.Nodes, startPosition + ChildListMutationIndex.Nodes + appendNodeCount),
      ).map(index => getNode(index) || index);

      return {
        target,
        nextSibling: getNode(mutations[startPosition + ChildListMutationIndex.NextSibling]) || null,
        previousSibling: getNode(mutations[startPosition + ChildListMutationIndex.PreviousSibling]) || null,
        addedNodes,
        removedNodes,
      };
    },
  };
}
