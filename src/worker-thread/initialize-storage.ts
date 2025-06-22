import type { Document } from './dom/Document.js';
import type { DocumentStub } from './dom/DocumentStub.js';

import { createStorage } from './Storage.js';
import { StorageLocation } from '../transfer/TransferrableStorage.js';

type InitStorageMap = { storage: { [key: string]: string }; errorMsg: null };
type InitStorageError = { storage: null; errorMsg: string };
export type WorkerStorageInit = InitStorageMap | InitStorageError;

export function initializeStorage(document: Document | DocumentStub, localStorageInit: WorkerStorageInit, sessionStorageInit: WorkerStorageInit) {
  const window = document.defaultView;
  if (localStorageInit.storage) {
    window.localStorage = createStorage(document, StorageLocation.Local, localStorageInit.storage);
  } else {
    console.warn(localStorageInit.errorMsg);
  }
  if (sessionStorageInit.storage) {
    window.sessionStorage = createStorage(document, StorageLocation.Session, sessionStorageInit.storage);
  } else {
    console.warn(sessionStorageInit.errorMsg);
  }
}
