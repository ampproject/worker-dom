import { WorkerContext } from './worker';
import { WorkerDOMConfiguration } from './configuration';
import { registerPromise } from './commands/function';
import { FunctionCallToWorker, MessageType } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';

/**
 * An ExportedWorker is returned by the upgradeElement API.
 * For the most part, it delegates to the underlying Worker.
 *
 * It notably removes `postMessage` support and adds `callFunction`.
 */
export class ExportedWorker {
  workerContext_: WorkerContext;
  config: WorkerDOMConfiguration;

  constructor(workerContext: WorkerContext, config: WorkerDOMConfiguration) {
    this.workerContext_ = workerContext;
    this.config = config;
  }

  /**
   * Calls a function in the worker and returns a promise with the result.
   * @param functionIdentifer
   * @param functionArguments
   */
  callFunction(functionIdentifer: string, ...functionArguments: any[]): Promise<any> {
    if (!this.config.executorsAllowed.includes(TransferrableMutationType.FUNCTION_CALL)) {
      throw new Error(`[worker-dom]: Error calling ${functionIdentifer}. You must enable the FUNCTION_CALL executor within the config.`);
    }

    const { promise, index } = registerPromise();
    const msg: FunctionCallToWorker = {
      [TransferrableKeys.type]: MessageType.FUNCTION,
      [TransferrableKeys.functionIdentifier]: functionIdentifer,
      [TransferrableKeys.functionArguments]: JSON.stringify(functionArguments),
      [TransferrableKeys.index]: index,
    };
    this.workerContext_.messageToWorker(msg);
    return promise;
  }

  set onerror(handler: any) {
    this.workerContext_.worker.onerror = handler;
  }

  terminate(): void {
    this.workerContext_.worker.terminate();
  }
}
