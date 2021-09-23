import { PropertyMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CommandExecutorInterface } from './interface';
import { NumericBoolean } from '../../utils';

export const PropertyProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.PROPERTIES);

  const getValue = (mutations: Uint16Array, startPosition: number): boolean | string | null => {
    const value = mutations[startPosition + PropertyMutationIndex.Value];
    if (mutations[startPosition + PropertyMutationIndex.IsBoolean] === NumericBoolean.TRUE) {
      return value === NumericBoolean.TRUE;
    }
    if (value !== 0) {
      return strings.get(value);
    }
    return null;
  };

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + PropertyMutationIndex.Target];
        const target = nodeContext.getNode(targetIndex);
        const name = strings.get(mutations[startPosition + PropertyMutationIndex.Name]);
        const value = getValue(mutations, startPosition);

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
          console.error(`PROPERTY: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + PropertyMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + PropertyMutationIndex.Target];
      const target = nodeContext.getNode(targetIndex);
      const name = strings.get(mutations[startPosition + PropertyMutationIndex.Name]);
      const value = getValue(mutations, startPosition);

      return {
        target,
        name,
        value,
        allowedExecution,
      };
    },
  };
};
