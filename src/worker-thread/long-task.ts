/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import { Node } from './dom/Node';
import { transfer } from './MutationTransfer';
import { Document } from './dom/Document';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

export function wrap(target: Node, func: Function): Function {
  return function () {
    return execute(target, Promise.resolve(func.apply(null, arguments)));
  };
}

function execute(target: Node, promise: Promise<any>): Promise<any> {
  // Start the task.
  transfer(target.ownerDocument as Document, [TransferrableMutationType.LONG_TASK_START, target[TransferrableKeys.index]]);
  return promise.then(
    (result) => {
      // Complete the task.
      transfer(target.ownerDocument as Document, [TransferrableMutationType.LONG_TASK_END, target[TransferrableKeys.index]]);
      return result;
    },
    (reason) => {
      // Complete the task.
      transfer(target.ownerDocument as Document, [TransferrableMutationType.LONG_TASK_END, target[TransferrableKeys.index]]);
      throw reason;
    },
  );
}
