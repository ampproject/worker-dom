import { CommandExecutorInterface } from './interface';
import { TransferrableMutationType, ScrollIntoViewMutationIndex } from '../../transfer/TransferrableMutation';

export const ScrollIntoViewProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.SCROLL_INTO_VIEW);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + ScrollIntoViewMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        if (target) {
          target.scrollIntoView();
        } else {
          console.error(`SCROLL_INTO_VIEW: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + ScrollIntoViewMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + ScrollIntoViewMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        type: 'SCROLL_INTO_VIEW',
        target,
        allowedExecution,
      };
    },
  };
};
