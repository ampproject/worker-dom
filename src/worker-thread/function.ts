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

import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Document } from './dom/Document';
import { MessageToWorker, MessageType, FunctionCallToWorker, ResolveOrReject } from '../transfer/Messages';
import { transfer } from './MutationTransfer';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { store } from './strings';
import { DocumentStub } from './dom/DocumentLite';

const exportedFunctions: { [fnIdent: string]: Function } = {};

export function callFunctionMessageHandler(event: MessageEvent, document: Document | DocumentStub) {
  const msg = event.data as MessageToWorker;
  if (msg[TransferrableKeys.type] !== MessageType.FUNCTION) {
    return;
  }

  const functionMessage = msg as FunctionCallToWorker;
  const fnIdentifier = functionMessage[TransferrableKeys.functionIdentifier];
  const fnArguments = JSON.parse(functionMessage[TransferrableKeys.functionArguments]);
  const index = functionMessage[TransferrableKeys.index];

  const fn = exportedFunctions[fnIdentifier];
  if (!fn) {
    transfer(document, [
      TransferrableMutationType.FUNCTION_CALL,
      ResolveOrReject.REJECT,
      index,
      store(JSON.stringify(`[worker-dom]: Exported function "${fnIdentifier}" could not be found.`)),
    ]);
    return;
  }

  Promise.resolve(fn) // Forcing promise flows allows us to skip a try/catch block.
    .then((f) => f.apply(null, fnArguments))
    .then(
      (value) => {
        transfer(document, [TransferrableMutationType.FUNCTION_CALL, ResolveOrReject.RESOLVE, index, store(JSON.stringify(value))]);
      },
      (err: Error) => {
        const errorMessage = JSON.stringify(err.message || err);

        transfer(document, [
          TransferrableMutationType.FUNCTION_CALL,
          ResolveOrReject.REJECT,
          index,
          store(JSON.stringify(`[worker-dom]: Function "${fnIdentifier}" threw: "${errorMessage}"`)),
        ]);
      },
    );
}
export function exportFunction(name: string, fn: Function) {
  if (!name || name === '') {
    throw new Error(`[worker-dom]: Attempt to export function was missing an identifier.`);
  }
  if (typeof fn !== 'function') {
    throw new Error(`[worker-dom]: Attempt to export non-function failed: ("${name}", ${typeof fn}).`);
  }
  if (name in exportedFunctions) {
    throw new Error(`[worker-dom]: Attempt to re-export function failed: "${name}".`);
  }
  exportedFunctions[name] = fn;
}

export function resetForTesting() {
  for (const key of Object.keys(exportedFunctions)) {
    delete exportedFunctions[key];
  }
}
