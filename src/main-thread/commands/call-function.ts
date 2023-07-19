import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { CallFunctionMutationIndex, TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { WorkerContext } from '../worker';

const successCallbackArg = '__successCallback__';
const errorCallbackArg = '__errorCallback__';

export const CallFunctionProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CALL_FUNCTION);

  return {
    execute(mutations: any[], allowedMutation: boolean) {
      const index = mutations[CallFunctionMutationIndex.Index];
      if (allowedExecution) {
        const target = mutations[CallFunctionMutationIndex.Target];
        if (target) {
          const functionName = mutations[CallFunctionMutationIndex.FunctionName];
          const args = mutations[CallFunctionMutationIndex.Arguments];
          const resultObjectId = mutations[CallFunctionMutationIndex.StoreResultObjectId];
          const isFunctionAsync: boolean = mutations[CallFunctionMutationIndex.IsFunctionAsync];

          function successCallback(value: any) {
            sendCallback(workerContext, index, true, value);
            if (resultObjectId > 0) {
              objectContext.store(resultObjectId, value);
            }
          }

          function errorCallback(reason: any) {
            if (typeof reason === 'object') {
              reason = String(reason);
            }
            sendCallback(workerContext, index, false, reason);
          }

          if (isFunctionAsync) {
            // handle async
            if (args.length > 0 && (args.includes(successCallbackArg) || args.includes(errorCallbackArg))) {
              // cb
              for (let idx = 0; idx < args.length; idx++) {
                const arg = args[idx];
                if (arg == successCallbackArg) {
                  args[idx] = successCallback;
                }
                if (arg == errorCallbackArg) {
                  args[idx] = errorCallback;
                }
              }
              target[functionName](...args);
            } else {
              // promise
              Promise.resolve(target[functionName](...args))
                .then(successCallback)
                .catch(errorCallback);
            }
          } else {
            try {
              const value = target[functionName](...args);
              successCallback(value);
            } catch (reason) {
              errorCallback(reason);
            }
          }
        } else {
          console.error(`CALL_FUNCTION: target is null.`);
          sendCallback(workerContext, index, false, 'Target object not found.');
        }
      } else {
        sendCallback(workerContext, index, false, 'Execution not allowed.');
      }
    },
    print(mutations: any[]): {} {
      const target: any = mutations[CallFunctionMutationIndex.Target];
      const functionName = mutations[CallFunctionMutationIndex.FunctionName];
      const requestId = mutations[CallFunctionMutationIndex.Index];
      const args = mutations[CallFunctionMutationIndex.Arguments];
      const resultObjectId = mutations[CallFunctionMutationIndex.StoreResultObjectId];
      const isFunctionAsync: boolean = mutations[CallFunctionMutationIndex.IsFunctionAsync];

      return {
        type: 'CALL_FUNCTION',
        allowedExecution,
        target,
        functionName,
        requestId,
        args,
        resultObjectId,
        isFunctionAsync,
      };
    },
  };
};

function sendCallback(workerContext: WorkerContext, index: number, success: boolean, value: any) {
  workerContext.messageToWorker({
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: index,
    [TransferrableKeys.success]: success,
    [TransferrableKeys.value]: value,
  });
}
