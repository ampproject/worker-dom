import { ObjectDeletionIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const ObjectDeletionProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_DELETION);

  if (!objectContext) {
    throw new Error('objectContext is not defined.');
  }

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation) {
        const objectId = mutations[ObjectDeletionIndex.ObjectId];

        objectContext.delete(objectId);
      }
    },
    print(mutations: any[]): {} {
      const objectId = mutations[ObjectDeletionIndex.ObjectId];
      return {
        type: 'OBJECT_DELETION',
        objectId,
      };
    },
  };
};
