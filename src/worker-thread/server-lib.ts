import { Document } from './dom/Document.js';
import { GlobalScope } from './WorkerDOMGlobalScope.js';

export function createDocument() {
  const win: GlobalScope = {} as any;
  return new Document(win);
}
