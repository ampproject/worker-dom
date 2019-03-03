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

import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { WorkerContext } from '../worker';

export class BoundingClientRectProcessor {
  private workerContext: WorkerContext;

  /**
   * @param nodeContext
   * @param workerContext whom to dispatch events toward.
   */
  constructor(workerContext: WorkerContext) {
    this.workerContext = workerContext;
  }

  /**
   * Process commands transfered from worker thread to main thread.
   * @param mutation mutation record containing commands to execute.
   */
  public process = (mutation: Uint16Array, target: RenderableElement): void => {
    if (!target) {
      console.error(`getNode() yields null – ${target}`);
      return;
    }

    const boundingRect = target.getBoundingClientRect();
    this.workerContext.messageToWorker({
      [TransferrableKeys.type]: MessageType.GET_BOUNDING_CLIENT_RECT,
      [TransferrableKeys.target]: [target._index_],
      [TransferrableKeys.data]: [
        boundingRect.top,
        boundingRect.right,
        boundingRect.bottom,
        boundingRect.left,
        boundingRect.width,
        boundingRect.height,
      ],
    });
  };
}
