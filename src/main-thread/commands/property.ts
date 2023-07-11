import { PropertyMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';

export const PropertyProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.PROPERTIES);

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation) {
        const target = mutations[PropertyMutationIndex.Target];
        const name = mutations[PropertyMutationIndex.Name];
        const value = mutations[PropertyMutationIndex.Value];

        if (target) {
          if (name && value != null) {
            if (config.sanitizer) {
              const mutated = config.sanitizer.setProperty(target, name, String(value));
              if (!mutated) {
                // TODO(choumx): Inform worker that sanitizer ignored unsafe property value change.
              }
            } else {
              target[name] = value;
            }
          }
        } else {
          console.error(`PROPERTY: target is null.`);
        }
      }
    },
    print(mutations: any[]): {} {
      const target = mutations[PropertyMutationIndex.Target];
      const name = mutations[PropertyMutationIndex.Name];
      const value = mutations[PropertyMutationIndex.Value];

      return {
        target,
        name,
        value,
        allowedExecution,
      };
    },
  };
};
