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

export class ExportedWorker {
  workerContext_: WorkerContext;
  config_: WorkerDOMConfiguration;

  constructor(workerContext: WorkerContext, config: WorkerDOMConfiguration) {
    this.workerContext_ = workerContext;
    this.config_ = config;
  }

  callFunction(functionIdentifer: string, ...functionArguments: any[]): Promise<any> {
    if (!this.config_.callFunctionAllowed) {
      throw new Error(`[worker-dom]: Error calling ${functionIdentifer}. You must enable callFunctionAllowed within the config.`);
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
