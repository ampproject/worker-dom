import { CommandExecutor, CommandExecutorInterface } from './interface';
import { ReadableMutationType, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { StringContext } from '../strings';
import { NodeContext } from '../nodes';
import { WorkerContext } from '../worker';
import { WorkerDOMConfiguration } from '../configuration';
import { ObjectContext } from '../object-context';

export interface LongTaskCommandExecutorInterface extends CommandExecutorInterface {
  (
    stringContext: StringContext,
    nodeContext: NodeContext,
    workerContext: WorkerContext,
    objectContext: ObjectContext,
    config: WorkerDOMConfiguration,
  ): LongTaskCommandExecutor;
}

export interface LongTaskCommandExecutor extends CommandExecutor {
  active: boolean;
}

export const LongTaskExecutor: LongTaskCommandExecutorInterface = (
  stringContext: StringContext,
  nodeContext: NodeContext,
  workerContext: WorkerContext,
  objectContext: ObjectContext,
  config: WorkerDOMConfiguration,
) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.LONG_TASK_START);
  let index: number = 0;
  let currentResolver: Function | null;

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      if (allowedExecution && allowedMutation && config.longTask) {
        if (mutations[0] === TransferrableMutationType.LONG_TASK_START) {
          index++;
          if (!currentResolver) {
            const newResolver = new Promise((resolve) => (currentResolver = resolve));
            // One of the worker-dom contracts is that there should not be two
            // LONG_TASK_STARTs in a row without an END in between. In case both exist within
            // the same set of mutations, we need to guard against having a consumers 1st END
            // handler occur after the START handler. If we synchronously called longTask() here it
            // would likely occur due to scheduling of callbacks vs. promise.
            // See: worker-dom/pull/989.
            Promise.resolve().then(() => config.longTask && config.longTask(newResolver));
          }
        } else if (mutations[0] === TransferrableMutationType.LONG_TASK_END) {
          index--;
          if (currentResolver && index <= 0) {
            currentResolver();
            currentResolver = null;
            index = 0;
          }
        }
      }
    },
    print(mutations: any[]): {} {
      return {
        type: ReadableMutationType[mutations[0]],
        allowedExecution,
      };
    },
    get active(): boolean {
      return currentResolver !== null;
    },
  };
};
