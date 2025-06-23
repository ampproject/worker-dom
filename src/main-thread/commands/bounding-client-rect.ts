import { TransferrableKeys } from '../../transfer/TransferrableKeys.js';
import { MessageType } from '../../transfer/Messages.js';
import { CommandExecutorInterface } from './interface.js';
import { BoundClientRectMutationIndex } from '../../transfer/TransferrableBoundClientRect.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';

export const BoundingClientRectProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.GET_BOUNDING_CLIENT_RECT);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + BoundClientRectMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        if (target) {
          const boundingRect = target.getBoundingClientRect();
          workerContext.messageToWorker({
            [TransferrableKeys.type]: MessageType.GET_BOUNDING_CLIENT_RECT,
            [TransferrableKeys.target]: [target._index_],
            [TransferrableKeys.data]: [
              boundingRect.top,
              boundingRect.right,
              boundingRect.bottom,
              boundingRect.left,
              boundingRect.width,
              boundingRect.height,
            ],
          });
        } else {
          console.error(`GET_BOUNDING_CLIENT_RECT: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + BoundClientRectMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + BoundClientRectMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        type: 'GET_BOUNDING_CLIENT_RECT',
        target,
        allowedExecution,
      };
    },
  };
};
