import { store as storeString } from './strings.js';
import { Document } from './dom/Document.js';
import { HydrateableNode } from '../transfer/TransferrableNodes.js';
import { TransferrableKeys } from '../transfer/TransferrableKeys.js';
import { appendKeys as addCssKeys } from './css/CSSStyleDeclaration.js';
import { appendGlobalEventProperties } from './dom/HTMLElement.js';
import { initializeStorage } from './initialize-storage.js';
import { WorkerStorageInit } from './initialize-storage.js';

export function initialize(
  document: Document,
  strings: Array<string>,
  hydrateableNode: HydrateableNode,
  cssKeys: Array<string>,
  globalEventHandlerKeys: Array<string>,
  [innerWidth, innerHeight]: [number, number],
  localStorageInit: WorkerStorageInit,
  sessionStorageInit: WorkerStorageInit,
): void {
  addCssKeys(cssKeys);
  appendGlobalEventProperties(globalEventHandlerKeys);
  strings.forEach(storeString);
  (hydrateableNode[TransferrableKeys.childNodes] || []).forEach((child) =>
    document.body.appendChild(document[TransferrableKeys.hydrateNode](strings, child)),
  );
  const window = document.defaultView;
  window.innerWidth = innerWidth;
  window.innerHeight = innerHeight;
  initializeStorage(document, localStorageInit, sessionStorageInit);
}
