import { ObjectCreationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const ObjectCreationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_CREATION);

  if (!objectContext) {
    throw new Error('objectContext is not defined.');
  }

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation) {
        const functionName = mutations[ObjectCreationIndex.FunctionName];
        const isConstructor = mutations[ObjectCreationIndex.IsConstructor];
        const objectId = mutations[ObjectCreationIndex.ObjectId];
        const target = mutations[ObjectCreationIndex.SerializedTarget];
        const args = mutations[ObjectCreationIndex.Arguments];

        let object;

        if (isConstructor) {
          object = new target[functionName](...args);
        } else if (isGetter(target, functionName)) {
          object = target[functionName];
        } else {
          object = target[functionName](...args);
        }

        objectContext.store(objectId, object);
      }
    },
    print(mutations: any[]): {} {
      const functionName = mutations[ObjectCreationIndex.FunctionName];
      const objectId = mutations[ObjectCreationIndex.ObjectId];
      const args = mutations[ObjectCreationIndex.Arguments];
      const target = mutations[ObjectCreationIndex.SerializedTarget];
      const isConstructor = mutations[ObjectCreationIndex.IsConstructor];
      const getter = isGetter(target, functionName);

      return {
        type: 'OBJECT_CREATION',
        target,
        functionName,
        isConstructor,
        objectId,
        args,
        getter,
        allowedExecution,
      };
    },
  };
};

function isGetter(object: {}, name: string): boolean {
  if (!object) {
    throw new Error(`Property ${name} does not exist on ${object}.`);
  }

  const descriptor = Object.getOwnPropertyDescriptor(object, name);

  if (descriptor !== undefined) {
    return 'get' in descriptor;
  }

  return isGetter(Object.getPrototypeOf(object), name);
}
