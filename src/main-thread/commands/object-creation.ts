import { TransferrableMutationType, ObjectCreationIndex } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { deserializeTransferrableObject } from '../deserializeTransferrableObject';

export const ObjectCreationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_CREATION);

  if (!objectContext) {
    throw new Error('objectContext is not defined.');
  }

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      const functionName = strings.get(mutations[startPosition + ObjectCreationIndex.FunctionName]);
      const objectId = mutations[startPosition + ObjectCreationIndex.ObjectId];
      const argCount = mutations[startPosition + ObjectCreationIndex.ArgumentCount];

      const { offset: targetOffset, args: deserializedTarget } = deserializeTransferrableObject(
        mutations,
        startPosition + ObjectCreationIndex.SerializedTarget,
        1, // argCount
        strings,
        nodeContext,
        objectContext,
      );
      const target = deserializedTarget[0] as any;

      const { offset: argsOffset, args } = deserializeTransferrableObject(mutations, targetOffset, argCount, strings, nodeContext, objectContext);

      if (allowedExecution && allowedMutation) {
        if (functionName === 'new') {
          // deal with constructor case here
        } else {
          objectContext.store(objectId, target[functionName](...args));
        }
      }

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const functionName = strings.get(mutations[startPosition + ObjectCreationIndex.FunctionName]);
      const objectId = mutations[startPosition + ObjectCreationIndex.ObjectId];
      const argCount = mutations[startPosition + ObjectCreationIndex.ArgumentCount];

      const { args: deserializedTarget } = deserializeTransferrableObject(
        mutations,
        startPosition + ObjectCreationIndex.SerializedTarget,
        1, // argCount
        strings,
        nodeContext,
        objectContext,
      );
      const target = deserializedTarget[0] as RenderableElement;

      return {
        type: 'OBJECT_CREATION',
        target,
        functionName,
        objectId,
        argCount,
        allowedExecution,
      };
    },
  };
};
