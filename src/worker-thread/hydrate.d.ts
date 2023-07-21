import type { Document } from './dom/Document';
import type { HydrateableNode } from '../transfer/TransferrableNodes';
import type { WorkerStorageInit } from './initialize-storage';

export type HydrateFunction = (
  document: Document,
  strings: Array<string>,
  hydrateableNode: HydrateableNode,
  cssKeys: Array<string>,
  globalEventHandlerKeys: Array<string>,
  [innerWidth, innerHeight, devicePixelRatio]: [number, number, number],
  localStorageInit: WorkerStorageInit,
  sessionStorageInit: WorkerStorageInit,
  webglInfo: {
    [type: string]: {
      extensions: string[] | null;
      attributes: WebGLContextAttributes | null;
      parameters: { [key: number]: any } | null;
    } | null;
  },
  location: { [type: string]: any },
) => void;
