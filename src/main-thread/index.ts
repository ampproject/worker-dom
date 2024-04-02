import { fetchAndInstall, install } from './install';
import { ExportedWorker } from './exported-worker';

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

export function upgradeElementByWorker(baseElement: Element, worker: Worker) {
  return install(Promise.resolve(['', '']), baseElement as HTMLElement, { worker });
}
