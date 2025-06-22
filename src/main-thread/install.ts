import { MutationFromWorker, MessageType, MessageFromWorker } from '../transfer/Messages.js';
import { MutatorProcessor } from './mutator.js';
import { NodeContext } from './nodes.js';
import { StringContext } from './strings.js';
import { TransferrableKeys } from '../transfer/TransferrableKeys.js';
import { InboundWorkerDOMConfiguration, normalizeConfiguration } from './configuration.js';
import { WorkerContext } from './worker.js';
import { ObjectContext } from './object-context.js';
import { ExportedWorker } from './exported-worker.js';

const ALLOWABLE_MESSAGE_TYPES = [MessageType.MUTATE, MessageType.HYDRATE];

/**
 * @param baseElement
 * @param authorScriptURL
 * @param workerDOMURL
 * @param callbacks
 * @param sanitizer
 * @param debug
 */
export function fetchAndInstall(baseElement: HTMLElement, config: InboundWorkerDOMConfiguration): Promise<ExportedWorker | null> {
  const fetchPromise = Promise.all([
    // TODO(KB): Fetch Polyfill for IE11.
    fetch(config.domURL).then((response) => response.text()),
    fetch(config.authorURL).then((response) => response.text()),
  ]);
  return install(fetchPromise, baseElement, config);
}

/**
 * @param fetchPromise
 * @param baseElement
 * @param config
 */
export function install(
  fetchPromise: Promise<[workerScript: string, authorScript: string]>,
  baseElement: HTMLElement,
  config: InboundWorkerDOMConfiguration,
): Promise<ExportedWorker | null> {
  const mode = baseElement.dataset['shadowDom'];
  if (mode === 'open' || mode === 'closed') {
    const shadowRoot = baseElement.attachShadow({ mode });
    const clonedElement = baseElement.cloneNode(true) as HTMLElement;
    shadowRoot.appendChild(clonedElement);
    baseElement = clonedElement;
  }
  const stringContext = new StringContext();
  const objectContext = new ObjectContext();
  const nodeContext = new NodeContext(stringContext, baseElement);
  const normalizedConfig = normalizeConfiguration(config);
  return fetchPromise.then(([domScriptContent, authorScriptContent]) => {
    if (domScriptContent && authorScriptContent && config.authorURL) {
      const workerContext = new WorkerContext(baseElement, nodeContext, domScriptContent, authorScriptContent, normalizedConfig);
      const mutatorContext = new MutatorProcessor(stringContext, nodeContext, workerContext, normalizedConfig, objectContext);
      workerContext.worker.onmessage = (message: MessageFromWorker) => {
        const { data } = message;

        if (!ALLOWABLE_MESSAGE_TYPES.includes(data[TransferrableKeys.type])) {
          return;
        }

        mutatorContext.mutate(
          (data as MutationFromWorker)[TransferrableKeys.phase],
          (data as MutationFromWorker)[TransferrableKeys.nodes],
          (data as MutationFromWorker)[TransferrableKeys.strings],
          new Uint16Array(data[TransferrableKeys.mutations]),
        );

        if (config.onReceiveMessage) {
          config.onReceiveMessage(message);
        }
      };

      return workerContext.ready().then(() => new ExportedWorker(workerContext, normalizedConfig));
    }
    return null;
  });
}
