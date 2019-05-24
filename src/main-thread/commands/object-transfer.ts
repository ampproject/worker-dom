import { TransferrableMutationType, ObjectTransferMutationIndex } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { deserialize } from '../global-id';

export const ObjectTransferProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.OFFSCREEN_POLYFILL);

  return {
    execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number {
      let { offset, args: des } = deserialize(mutations, startPosition + ObjectTransferMutationIndex.Target, 1, strings, nodeContext);
      target = des[0] as RenderableElement;

      const functionName = strings.get(mutations[offset++]);
      const argCount = mutations[offset++];

      const { offset: argsOffset, args } = deserialize(mutations, offset, argCount, strings, nodeContext);

      if (allowedExecution) {
        if (isSetter(target, functionName)) {
          (target as any)[functionName] = args[0];
        } else {
          (target as any)[functionName](...args);
        }
      }

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object {
      return {};
    },
  };
};

function isSetter(object: Object, name: string): boolean {
  // use Object.getOwnPropertyDescriptor to determine if method is a setter or not
  // defer this until the rest of it works, hard code setters used in demo
  const props = ['fillStyle', 'strokeStyle', 'lineWidth'];
  return props.includes(name);
}
