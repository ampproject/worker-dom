import { TransferrableMutationType, ObjectMutationIndex } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { deserializeTransferrableObject } from '../deserializeTransferrableObject';

export const ObjectMutationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OBJECT_MUTATION);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      const functionName = strings.get(mutations[startPosition + ObjectMutationIndex.FunctionName]);
      const argCount = mutations[startPosition + ObjectMutationIndex.ArgumentCount];

      const { offset: targetOffset, args: deserializedTarget } = deserializeTransferrableObject(
        mutations,
        startPosition + ObjectMutationIndex.SerializedTarget,
        1,
        strings,
        nodeContext,
        objectContext,
      );
      const target = deserializedTarget[0] as any;

      const { offset: argsOffset, args } = deserializeTransferrableObject(mutations, targetOffset, argCount, strings, nodeContext, objectContext);

      if (allowedExecution && allowedMutation) {
        if (isSetter(target, functionName)) {
          target[functionName] = args[0];
        } else {
          target[functionName](...args);
        }
      }

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const functionName = strings.get(mutations[startPosition + ObjectMutationIndex.FunctionName]);
      const { args: deserializedTarget } = deserializeTransferrableObject(
        mutations,
        startPosition + ObjectMutationIndex.SerializedTarget,
        1,
        strings,
        nodeContext,
        objectContext,
      );
      const target = deserializedTarget[0] as RenderableElement;

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
