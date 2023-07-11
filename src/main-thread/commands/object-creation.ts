import { ObjectCreationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const ObjectCreationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_CREATION);

  if (!objectContext) {
    throw new Error('objectContext is not defined.');
  }

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      const functionName = mutations[ObjectCreationIndex.FunctionName];
      const objectId = mutations[ObjectCreationIndex.ObjectId];
      const target = mutations[ObjectCreationIndex.SerializedTarget];
      const args = mutations[ObjectCreationIndex.Arguments];

      if (allowedExecution && allowedMutation) {
        if (functionName === 'new') {
          // deal with constructor case here
        } else {
          objectContext.store(objectId, target[functionName](...args));
        }
      }
    },
    print(mutations: any[]): {} {
      const functionName = mutations[ObjectCreationIndex.FunctionName];
      const objectId = mutations[ObjectCreationIndex.ObjectId];
      const args = mutations[ObjectCreationIndex.Arguments];
      const target = mutations[ObjectCreationIndex.SerializedTarget];

      return {
        type: 'OBJECT_CREATION',
        target,
        functionName,
        objectId,
        args,
        allowedExecution,
      };
    },
  };
};
