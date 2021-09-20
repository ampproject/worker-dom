import type { GlobalScope } from './WorkerDOMGlobalScope';

import { Document } from './dom/Document';

export function createDocument() {
  const win: GlobalScope = {} as any;
  return new Document(win);
}
