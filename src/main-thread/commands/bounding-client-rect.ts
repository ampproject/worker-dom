import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { BoundClientRectMutationIndex } from '../../transfer/TransferrableBoundClientRect';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

export const BoundingClientRectProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.GET_BOUNDING_CLIENT_RECT);

  return {
    execute(mutations: any[], allowedMutation: boolean): void {
      if (allowedExecution && allowedMutation) {
        const target = mutations[BoundClientRectMutationIndex.Target];
        if (target) {
          const boundingRect = target.getBoundingClientRect();
          workerContext.messageToWorker(
            {
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
            },
            [],
          );
        } else {
          console.error(`GET_BOUNDING_CLIENT_RECT: target is null.`);
        }
      }
    },
    print(mutations: any[]): {} {
      const target = mutations[BoundClientRectMutationIndex.Target];
      return {
        type: 'GET_BOUNDING_CLIENT_RECT',
        target,
        allowedExecution,
      };
    },
  };
};
