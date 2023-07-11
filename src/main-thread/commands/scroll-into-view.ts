import { CommandExecutorInterface } from './interface';
import { ScrollIntoViewMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';

export const ScrollIntoViewProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.SCROLL_INTO_VIEW);

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation) {
        const target = mutations[ScrollIntoViewMutationIndex.Target];
        if (target) {
          target.scrollIntoView();
        } else {
          console.error(`SCROLL_INTO_VIEW: target is null.`);
        }
      }
    },
    print(mutations: any[]): {} {
      const target = mutations[ScrollIntoViewMutationIndex.Target];
      return {
        type: 'SCROLL_INTO_VIEW',
        target,
        allowedExecution,
      };
    },
  };
};
