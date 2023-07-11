import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { CallFunctionMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';

export const CallFunctionProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CALL_FUNCTION);

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      const target = mutations[CallFunctionMutationIndex.Target];
      const functionName = mutations[CallFunctionMutationIndex.FunctionName];
      const index = mutations[CallFunctionMutationIndex.Index];
      const args = mutations[CallFunctionMutationIndex.Arguments];

      let result = null;
      let success = false;

      if (allowedExecution) {
        if (target) {
          try {
            result = target[functionName](...args);
            success = true;
          } catch (e) {
            console.error(`Method ${functionName} execution failed`, target, args, e);
            result = e.message;
          }
        } else {
          console.error(`CALL_FUNCTION: target is null.`);
          result = new Error('Target object not found.').message;
        }
      } else {
        result = new Error('Execution not allowed.').message;
      }

      workerContext.messageToWorker({
        [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
        [TransferrableKeys.index]: index,
        [TransferrableKeys.success]: success,
        [TransferrableKeys.value]: result,
      });
    },
    print(mutations: any[]): {} {
      const target: any = mutations[CallFunctionMutationIndex.Target];
      const functionName = mutations[CallFunctionMutationIndex.FunctionName];
      const requestId = mutations[CallFunctionMutationIndex.Index];
      const args = mutations[CallFunctionMutationIndex.Arguments];

      return {
        type: 'CALL_FUNCTION',
        allowedExecution,
        target,
        functionName,
        requestId,
        args,
      };
    },
  };
};
