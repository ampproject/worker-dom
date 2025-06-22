import { fetchAndInstall } from './install.js';
import { ExportedWorker } from './exported-worker.js';

export function upgradeElement(baseElement: Element, domURL: string): Promise<ExportedWorker | null> {
  const authorURL = baseElement.getAttribute('src');
  if (authorURL) {
    return fetchAndInstall(baseElement as HTMLElement, {
      authorURL,
      domURL,
    });
  }
  return Promise.resolve(null);
}
