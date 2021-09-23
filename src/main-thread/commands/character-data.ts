import { CharacterDataMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const CharacterDataProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CHARACTER_DATA);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + CharacterDataMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        const value = mutations[startPosition + CharacterDataMutationIndex.Value];
        if (target) {
          if (value) {
            // Sanitization not necessary for textContent.
            target.textContent = strings.get(value);
          }
        } else {
          console.error(`CHAR_DATA: getNode(${targetIndex}) is null.`);
        }
      }
      return startPosition + CharacterDataMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + CharacterDataMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        target,
        allowedExecution,
        value: strings.get(mutations[startPosition + CharacterDataMutationIndex.Value]),
      };
    },
  };
};
