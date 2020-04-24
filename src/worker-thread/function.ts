/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
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

import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Document } from './dom/Document';
import { MessageToWorker, MessageType, FunctionInvocationToWorker, ResolveOrReject } from '../transfer/Messages';
import { transfer } from './MutationTransfer';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { store } from './strings';

function functionInvocationMessageHandler(event: MessageEvent, document: Document) {
  const msg = event.data as MessageToWorker;
  if (msg[TransferrableKeys.type] !== MessageType.FUNCTION) {
    return;
  }

  const functionMessage = msg as FunctionInvocationToWorker;
  const fnIdentifier = functionMessage[TransferrableKeys.functionIdentifier];
  const fnArguments = JSON.parse(functionMessage[TransferrableKeys.functionArguments]);
  const index = functionMessage[TransferrableKeys.index];

  const fn = (self as any)[fnIdentifier];
  if (!fn || typeof fn !== 'function') {
    transfer(document, [
      TransferrableMutationType.FUNCTION_INVOCATION,
      ResolveOrReject.REJECT,
      index,
      store(`[worker-dom]: Function with identifier: ${fnIdentifier} does not exist on the global scope.`),
    ]);
    return;
  }

  Promise.resolve(fn) // Forcing promise flows allows us to skip a try/catch block.
    .then((f) => f.apply(null, fnArguments))
    .then(
      (value) => {
        transfer(document, [TransferrableMutationType.FUNCTION_INVOCATION, ResolveOrReject.RESOLVE, index, store(JSON.stringify(value))]);
      },
      (err: any) => {
        const errorMessage = err.message || JSON.stringify(err);

        transfer(document, [
          TransferrableMutationType.FUNCTION_INVOCATION,
          ResolveOrReject.REJECT,
          index,
          store(`[worker-dom]: Function with identifier: ${fnIdentifier} threw an error with the message: ${errorMessage}`),
        ]);
      },
    );
}

export function installEventListener(doc: Document) {
  // TODO(samouri): make this a class so that doc is an ivar, like amp.ts.
  doc.addGlobalEventListener('message', (evt: MessageEvent) => functionInvocationMessageHandler(evt, doc));
}
