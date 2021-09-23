import { ChildListMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { NodeContext } from '../nodes';
import { applyDefaultInputListener, sendValueChangeOnAttributeMutation } from './event-subscription';

export const ChildListProcessor: CommandExecutorInterface = (strings, { getNode }: NodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CHILD_LIST);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      const appendNodeCount = mutations[startPosition + ChildListMutationIndex.AppendedNodeCount];
      const removeNodeCount = mutations[startPosition + ChildListMutationIndex.RemovedNodeCount];
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + ChildListMutationIndex.Target];
        const target = getNode(targetIndex);
        if (target) {
          if (removeNodeCount > 0) {
            mutations
              .slice(
                startPosition + ChildListMutationIndex.Nodes + appendNodeCount,
                startPosition + ChildListMutationIndex.Nodes + appendNodeCount + removeNodeCount,
              )
              .forEach((removeId) => {
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
              .forEach((addId) => {
                const nextSibling = mutations[startPosition + ChildListMutationIndex.NextSibling];
                const newNode = getNode(addId);
                if (newNode) {
                  // TODO: Handle this case ---
                  // Transferred nodes that are not stored were previously removed by the sanitizer.
                  target.insertBefore(newNode, (nextSibling && getNode(nextSibling)) || null);
                  applyDefaultInputListener(workerContext, newNode);
                  sendValueChangeOnAttributeMutation(workerContext, newNode);
                }
              });
          }
        } else {
          console.error(`CHILD_LIST: getNode(${targetIndex}) is null.`);
        }
      }
      return startPosition + ChildListMutationIndex.End + appendNodeCount + removeNodeCount;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + ChildListMutationIndex.Target];
      const target = getNode(targetIndex);
      const appendNodeCount = mutations[startPosition + ChildListMutationIndex.AppendedNodeCount];
      const removeNodeCount = mutations[startPosition + ChildListMutationIndex.RemovedNodeCount];
      const removedNodes = Array.from(
        mutations.slice(
          startPosition + ChildListMutationIndex.Nodes + appendNodeCount,
          startPosition + ChildListMutationIndex.Nodes + appendNodeCount + removeNodeCount,
        ),
      ).map((index) => getNode(index) || index);
      const addedNodes = Array.from(
        mutations.slice(startPosition + ChildListMutationIndex.Nodes, startPosition + ChildListMutationIndex.Nodes + appendNodeCount),
      ).map((index) => getNode(index) || index);

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
