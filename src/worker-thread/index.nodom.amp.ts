import { HydrateFunction } from './hydrate.js';
import { AMP } from './amp/amp.js';
import { callFunctionMessageHandler, exportFunction } from './function.js';
import { WorkerNoDOMGlobalScope } from './WorkerDOMGlobalScope.js';
import { DocumentStub } from './dom/DocumentStub.js';
import { deleteGlobals } from './amp/delete-globals.js';
import { initializeStorage } from './initialize-storage.js';
import { WorkerStorageInit } from './initialize-storage.js';

const noop = () => void 0;

export const workerDOM: WorkerNoDOMGlobalScope = (function (postMessage, addEventListener, removeEventListener) {
  const document = new DocumentStub();

  // TODO(choumx): Avoid polluting Document's public API.
  document.postMessage = postMessage;
  document.addGlobalEventListener = addEventListener;
  document.removeGlobalEventListener = removeEventListener;
  return document.defaultView;
})(postMessage.bind(self) || noop, addEventListener.bind(self) || noop, removeEventListener.bind(self) || noop);

// Modify global scope by removing disallowed properties.
deleteGlobals(self);

// Offer APIs like AMP.setState() on the global scope.
(self as any).AMP = new AMP(workerDOM.document);

// Allows for function invocation
(self as any).exportFunction = exportFunction;
addEventListener('message', (evt: MessageEvent) => callFunctionMessageHandler(evt, workerDOM.document));

export const hydrate: HydrateFunction = (
  document: DocumentStub,
  strings: Object,
  hydrateableNode: Object,
  cssKeys: Object,
  globalEventHandlerKeys: Object,
  size: Object,
  localStorageInit: WorkerStorageInit,
  sessionStorageInit: WorkerStorageInit,
) => {
  initializeStorage(document, localStorageInit, sessionStorageInit);
};
