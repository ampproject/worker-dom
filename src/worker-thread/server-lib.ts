import { Document } from './dom/Document';
import { GlobalScope } from './WorkerDOMGlobalScope';

export function createDocument() {
  const win: GlobalScope = {} as any;
  return new Document(win);
}
