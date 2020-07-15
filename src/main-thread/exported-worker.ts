/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { WorkerContext } from './worker';
import { WorkerDOMConfiguration } from './configuration';
import { registerPromise } from './commands/function';
import { FunctionCallToWorker, MessageType } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

/**
 * An ExportedWorker is returned by the upgradeElement API.
 * For the most part, it delegates to the underlying Worker.
 *
 * It notably removes `postMessage` support and add `callFunction`.
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
