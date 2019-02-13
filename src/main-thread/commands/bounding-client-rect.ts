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

import { TransferrableMutationRecord } from '../../transfer/TransferrableRecord';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { getNode } from '../nodes';
import { messageToWorker } from '../worker';
import { MessageType } from '../../transfer/Messages';
import { NumericBoolean } from '../../utils';

/**
 * Process commands transfered from worker thread to main thread.
 * @param nodesInstance nodes instance to execute commands against.
 * @param worker whom to dispatch events toward.
 * @param mutation mutation record containing commands to execute.
 */
export function process(worker: Worker, mutation: TransferrableMutationRecord): void {
  const nodeId = mutation[TransferrableKeys.target];
  const target = getNode(nodeId);

  if (!target) {
    console.error('getNode() yields a null value. Node id (' + nodeId + ') was not found.');
    return;
  }

  const boundingRect = target.getBoundingClientRect();
  messageToWorker(worker, {
    [TransferrableKeys.type]: MessageType.GET_BOUNDING_CLIENT_RECT,
    [TransferrableKeys.target]: {
      [TransferrableKeys.index]: target._index_,
      [TransferrableKeys.transferred]: NumericBoolean.TRUE,
    },
    [TransferrableKeys.data]: [boundingRect.top, boundingRect.right, boundingRect.bottom, boundingRect.left, boundingRect.width, boundingRect.height],
  });
}
