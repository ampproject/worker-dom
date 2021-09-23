/**
 * @fileoverview This entry point API in active development and unstable.
 */

import { fetchAndInstall, install } from './install';
import { WorkerDOMConfiguration, LongTaskFunction } from './configuration';
import { toLower } from '../utils';
import { ExportedWorker } from './exported-worker';

/**
 * AMP Element Children need to be filtered from Hydration, to avoid Author Code from manipulating it.
 * TODO: In the future, this contract needs to be more defined.
 * @param element
 */
const hydrateFilter = (element: RenderableElement) => {
  if (element.parentNode !== null) {
    const lowerName = toLower((element.parentNode as RenderableElement).localName || (element.parentNode as RenderableElement).nodeName);
    return !/amp-/.test(lowerName) || lowerName === 'amp-script';
  }
  return true;
};

/**
 * @param baseElement
 * @param domURL
 */
export function upgradeElement(
  baseElement: Element,
  domURL: string,
  longTask?: LongTaskFunction,
  sanitizer?: Sanitizer,
  sandbox?: { iframeUrl: string },
): Promise<ExportedWorker | null> {
  const authorURL = baseElement.getAttribute('src');
  if (authorURL) {
    return fetchAndInstall(baseElement as HTMLElement, {
      domURL,
      authorURL,
      longTask,
      hydrateFilter,
      sanitizer,
      sandbox,
    });
  }
  return Promise.resolve(null);
}

/**
 * @param baseElement
 * @param fetchPromise Promise that resolves containing worker script, and author script.
 */
export function upgrade(
  baseElement: Element,
  fetchPromise: Promise<[string, string]>,
  config: WorkerDOMConfiguration,
): Promise<ExportedWorker | null> {
  config.hydrateFilter = hydrateFilter;
  return install(fetchPromise, baseElement as HTMLElement, config);
}
