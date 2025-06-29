import { Node } from './dom/Node.js';
import { transfer } from './MutationTransfer.js';
import { Document } from './dom/Document.js';
import { TransferrableMutationType } from '../transfer/TransferrableMutation.js';
import { TransferrableKeys } from '../transfer/TransferrableKeys.js';

export function wrap(target: Node, func: Function): Function {
  return function () {
    return execute(target, Promise.resolve(func.apply(null, arguments)));
  };
}

function execute(target: Node, promise: Promise<any>): Promise<any> {
  // Start the task.
  transfer(target.ownerDocument as Document, [TransferrableMutationType.LONG_TASK_START, target[TransferrableKeys.index]]);
  return promise.then(
    (result) => {
      // Complete the task.
      transfer(target.ownerDocument as Document, [TransferrableMutationType.LONG_TASK_END, target[TransferrableKeys.index]]);
      return result;
    },
    (reason) => {
      // Complete the task.
      transfer(target.ownerDocument as Document, [TransferrableMutationType.LONG_TASK_END, target[TransferrableKeys.index]]);
      throw reason;
    },
  );
}
