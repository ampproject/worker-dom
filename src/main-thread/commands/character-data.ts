import { CharacterDataMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const CharacterDataProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CHARACTER_DATA);

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation) {
        const target = mutations[CharacterDataMutationIndex.Target];
        const value = mutations[CharacterDataMutationIndex.Value];
        if (target) {
          if (value) {
            // Sanitization not necessary for textContent.
            target.textContent = value;
          }
        } else {
          console.error(`CHAR_DATA: target is null.`);
        }
      }
    },
    print(mutations: any[]): {} {
      const target = mutations[CharacterDataMutationIndex.Target];
      return {
        target,
        allowedExecution,
        value: mutations[CharacterDataMutationIndex.Value],
      };
    },
  };
};
