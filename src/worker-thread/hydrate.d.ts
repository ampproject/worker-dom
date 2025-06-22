import type { Document } from './dom/Document.js';
import type { HydrateableNode } from '../transfer/TransferrableNodes.js';
import type { WorkerStorageInit } from './initialize-storage.js';

export type HydrateFunction = (
  document: Document,
  strings: Array<string>,
  hydrateableNode: HydrateableNode,
  cssKeys: Array<string>,
  globalEventHandlerKeys: Array<string>,
  [innerWidth, innerHeight]: [number, number],
  localStorageInit: WorkerStorageInit,
  sessionStorageInit: WorkerStorageInit,
) => void;
