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

import { ChildListMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { NodeContext } from '../nodes';

export const ChildListProcessor: CommandExecutorInterface = (strings, { getNode }: NodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CHILD_LIST);

  return {
    execute(mutations: Uint16Array, startPosition: number): number {
      const appendNodeCount = mutations[startPosition + ChildListMutationIndex.AppendedNodeCount];
      const removeNodeCount = mutations[startPosition + ChildListMutationIndex.RemovedNodeCount];
      if (allowedExecution) {
        const targetIndex = mutations[startPosition + ChildListMutationIndex.Target];
        const target = getNode(targetIndex);
        if (target) {
          if (removeNodeCount > 0) {
            mutations
              .slice(
                startPosition + ChildListMutationIndex.Nodes + appendNodeCount,
                startPosition + ChildListMutationIndex.Nodes + appendNodeCount + removeNodeCount,
              )
              .forEach(removeId => {
                const node = getNode(removeId);
                if (node) {
                  node.remove();
                } else {
                  console.error(`CHILD_LIST: getNode(${removeId}) is null.`);
                }
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
        } else {
          console.error(`CHILD_LIST: getNode(${targetIndex}) is null.`);
        }
      }
      return startPosition + ChildListMutationIndex.End + appendNodeCount + removeNodeCount;
    },
    print(mutations: Uint16Array, startPosition: number): Object {
      const targetIndex = mutations[startPosition + ChildListMutationIndex.Target];
      const target = getNode(targetIndex);
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
        allowedExecution,
        nextSibling: getNode(mutations[startPosition + ChildListMutationIndex.NextSibling]) || null,
        previousSibling: getNode(mutations[startPosition + ChildListMutationIndex.PreviousSibling]) || null,
        addedNodes,
        removedNodes,
      };
    },
  };
};
