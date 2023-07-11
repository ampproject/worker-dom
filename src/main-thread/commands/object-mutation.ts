import { ObjectMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const ObjectMutationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_MUTATION);

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      const functionName = mutations[ObjectMutationIndex.FunctionName];
      const args = mutations[ObjectMutationIndex.Arguments];
      const target = mutations[ObjectMutationIndex.SerializedTarget];

      if (allowedExecution && allowedMutation) {
        if (isSetter(target, functionName)) {
          target[functionName] = args[0];
        } else {
          target[functionName](...args);
        }
      }
    },
    print(mutations: any[]): {} {
      const functionName = mutations[ObjectMutationIndex.FunctionName];
      const target = mutations[ObjectMutationIndex.SerializedTarget];

      return {
        type: 'OBJECT_MUTATION',
        target,
        functionName,
        isSetter: isSetter(target, functionName),
        allowedExecution,
      };
    },
  };
};

function isSetter(object: {}, name: string): boolean {
  if (!object) {
    throw new Error(`Property ${name} does not exist on ${object}.`);
  }

  const descriptor = Object.getOwnPropertyDescriptor(object, name);

  if (descriptor !== undefined) {
    return 'set' in descriptor;
  }

  return isSetter(Object.getPrototypeOf(object), name);
}
