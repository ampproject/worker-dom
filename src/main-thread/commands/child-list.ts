import { ChildListMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { NodeContext } from '../nodes';
import { applyDefaultInputListener, sendValueChangeOnAttributeMutation } from './event-subscription';

export const ChildListProcessor: CommandExecutorInterface = (strings, { getNode }: NodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CHILD_LIST);

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      const appendNodeCount = mutations[ChildListMutationIndex.AppendedNodeCount];
      const removeNodeCount = mutations[ChildListMutationIndex.RemovedNodeCount];
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[ChildListMutationIndex.Target];
        const target = getNode(targetIndex);
        if (target) {
          if (removeNodeCount > 0) {
            mutations
              .slice(ChildListMutationIndex.Nodes + appendNodeCount, ChildListMutationIndex.Nodes + appendNodeCount + removeNodeCount)
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
            mutations.slice(ChildListMutationIndex.Nodes, ChildListMutationIndex.Nodes + appendNodeCount).forEach((addId) => {
              const nextSibling = mutations[ChildListMutationIndex.NextSibling];
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
    },
    print(mutations: any[]): {} {
      const targetIndex = mutations[ChildListMutationIndex.Target];
      const target = getNode(targetIndex);
      const appendNodeCount = mutations[ChildListMutationIndex.AppendedNodeCount];
      const removeNodeCount = mutations[ChildListMutationIndex.RemovedNodeCount];
      const removedNodes = Array.from(
        mutations.slice(ChildListMutationIndex.Nodes + appendNodeCount, ChildListMutationIndex.Nodes + appendNodeCount + removeNodeCount),
      ).map((index) => getNode(index) || index);
      const addedNodes = Array.from(mutations.slice(ChildListMutationIndex.Nodes, ChildListMutationIndex.Nodes + appendNodeCount)).map(
        (index) => getNode(index) || index,
      );

      return {
        target,
        allowedExecution,
        nextSibling: getNode(mutations[ChildListMutationIndex.NextSibling]) || null,
        previousSibling: getNode(mutations[ChildListMutationIndex.PreviousSibling]) || null,
        addedNodes,
        removedNodes,
      };
    },
  };
};
