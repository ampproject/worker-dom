/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MutationFromWorker, MessageType, MessageFromWorker, MessageToWorker } from '../transfer/Messages';
import { MutatorProcessor } from './mutator';
import { NodeContext } from './nodes';
import { StringContext } from './strings';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { InboundWorkerDOMConfiguration, normalizeConfiguration, WorkerDOMConfiguration } from './configuration';
import { WorkerContext } from './worker';
import { ObjectContext } from './object-context';
import { readableMessageToWorker, readableHydrateableRootNode } from './debugging';
import { createHydrateableRootNode } from './serialize';

const ALLOWABLE_MESSAGE_TYPES = [MessageType.MUTATE, MessageType.HYDRATE];

export function attachWorker(
  baseElement: HTMLElement,
  worker: Worker,
  config: InboundWorkerDOMConfiguration = {
    authorURL: '[external-instance]',
    domURL: '[external-instance]',
  },
) {
  const stringContext = new StringContext();
  const objectContext = new ObjectContext();
  const nodeContext = new NodeContext(stringContext, baseElement);
  const normalizedConfig = normalizeConfiguration(config);
  const workerContext = (new WorkerContextFromInstance(baseElement as HTMLElement, nodeContext, worker, normalizedConfig) as any) as WorkerContext;
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
}

// TODO: Refactor with original
class WorkerContextFromInstance {
  private [TransferrableKeys.worker]: Worker;
  private nodeContext: NodeContext;
  private config: WorkerDOMConfiguration;

  /**
   * @param baseElement
   * @param nodeContext
   * @param workerDOMScript
   * @param authorScript
   * @param config
   */
  constructor(baseElement: HTMLElement, nodeContext: NodeContext, worker: Worker, config: WorkerDOMConfiguration) {
    const selfAsWorkerContext = (this as any) as WorkerContext;
    this.nodeContext = nodeContext;
    this.config = config;

    const { skeleton, strings } = createHydrateableRootNode(baseElement, config, selfAsWorkerContext);
    const cssKeys: Array<string> = [];
    const globalEventHandlerKeys: Array<string> = [];
    // TODO(mizchi): Can not serialize on postMessage
    // TODO(choumx): Sync read of all localStorage and sessionStorage a possible performance bottleneck?
    // const localStorageData = config.sanitizer ? config.sanitizer.getStorage(StorageLocation.Local) : window.localStorage;
    // const sessionStorageData = config.sanitizer ? config.sanitizer.getStorage(StorageLocation.Session) : window.sessionStorage;

    for (const key in baseElement.style) {
      cssKeys.push(key);
    }
    for (const key in baseElement) {
      if (key.startsWith('on')) {
        globalEventHandlerKeys.push(key);
      }
    }

    this[TransferrableKeys.worker] = worker;
    worker.postMessage({
      __init__: [
        strings,
        skeleton,
        cssKeys,
        globalEventHandlerKeys,
        [window.innerWidth, window.innerHeight],
        {}, // localStorage
        {}, // sessionStorage
      ],
    });

    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'hydratedNode', readableHydrateableRootNode(baseElement, config, selfAsWorkerContext));
    }
    if (config.onCreateWorker) {
      config.onCreateWorker(baseElement, strings, skeleton, cssKeys);
    }
  }

  /**
   * Returns the private worker.
   */
  get worker(): Worker {
    return this[TransferrableKeys.worker];
  }

  /**
   * @param message
   */
  messageToWorker(message: MessageToWorker, transferables?: Transferable[]) {
    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'messageToWorker', readableMessageToWorker(this.nodeContext, message));
    }
    if (this.config.onSendMessage) {
      this.config.onSendMessage(message);
    }
    this.worker.postMessage(message, transferables || []);
  }
}
