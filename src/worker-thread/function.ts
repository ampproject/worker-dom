import { TransferrableKeys } from '../transfer/TransferrableKeys.js';
import { Document } from './dom/Document.js';
import { MessageToWorker, MessageType, FunctionCallToWorker, ResolveOrReject } from '../transfer/Messages.js';
import { transfer } from './MutationTransfer.js';
import { TransferrableMutationType } from '../transfer/TransferrableMutation.js';
import { store } from './strings.js';
import { DocumentStub } from './dom/DocumentStub.js';

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
      store(JSON.stringify({
        stack: '',
        message: `[worker-dom]: Exported function "${fnIdentifier}" could not be found.`
      })),
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
          store(JSON.stringify({
            stack: err.stack || '',
            message: `[worker-dom]: Function "${fnIdentifier}" threw: "${errorMessage}"`
          }))
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
