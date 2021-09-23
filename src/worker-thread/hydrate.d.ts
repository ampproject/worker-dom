import type { Document } from './dom/Document';
import type { HydrateableNode } from '../transfer/TransferrableNodes';
import type { WorkerStorageInit } from './initialize-storage';

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
