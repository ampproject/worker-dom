import {TransferrableKeys} from '../../transfer/TransferrableKeys';
import {MessageType} from '../../transfer/Messages';
import {CommandExecutorInterface} from './interface';
import {
  CallFunctionMutationIndex,
  TransferrableMutationType, TransferrableObjectType
} from '../../transfer/TransferrableMutation';
import {deserializeTransferrableObject} from "../deserializeTransferrableObject";
import {NodeContext} from "../nodes";
import {ObjectContext} from "../object-context";

function getTarget(id: number, type: TransferrableObjectType, nodes: NodeContext, objectContext: ObjectContext): any {
  switch (type) {
    case TransferrableObjectType.HTMLElement:
      return nodes.getNode(id);
    case TransferrableObjectType.TransferObject:
      return objectContext.get(id);
    case TransferrableObjectType.Window:
      return window;
    default:
      return null;
  }
}

export const CallFunctionProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.CALL_FUNCTION);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      const targetType: TransferrableObjectType = mutations[startPosition + CallFunctionMutationIndex.TargetType] as TransferrableObjectType;
      const targetId = mutations[startPosition + CallFunctionMutationIndex.Target];

      const target: any = getTarget(targetId, targetType, nodes, objectContext);

      const index = mutations[startPosition + CallFunctionMutationIndex.Index];

      const functionName = strings.get(mutations[startPosition + CallFunctionMutationIndex.FunctionName]);
      const argCount = mutations[startPosition + CallFunctionMutationIndex.ArgumentCount];
      const { offset: argsOffset, args } = deserializeTransferrableObject(mutations, startPosition + CallFunctionMutationIndex.Arguments, argCount, strings, nodes, objectContext);
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
          console.error(`CALL_FUNCTION: target is null.`, targetId, targetType);
          result = new Error("Target object not found.").message;
        }
      } else {
        result = new Error("Execution not allowed.").message;
      }

      // TODO: detect js transferable objects
      workerContext.messageToWorker({
        [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
        [TransferrableKeys.index]: index,
        [TransferrableKeys.success]: success,
        [TransferrableKeys.value]: result,
      });

      return argsOffset;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const target: any = objectContext.get(mutations[startPosition + CallFunctionMutationIndex.Target]);
      const functionName = strings.get(mutations[startPosition + CallFunctionMutationIndex.FunctionName]);
      const requestId = mutations[startPosition + CallFunctionMutationIndex.Index];
      const argCount = mutations[startPosition + CallFunctionMutationIndex.ArgumentCount];
      const { args } = deserializeTransferrableObject(mutations, startPosition + CallFunctionMutationIndex.Arguments, argCount, strings, nodes, objectContext);

      return {
        type: 'CALL_FUNCTION',
        allowedExecution,
        target,
        functionName,
        requestId,
        argCount,
        args
      };
    },
  };
};
