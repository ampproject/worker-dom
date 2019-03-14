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

import { LongTaskFunction, WorkerCallbacks } from '../callbacks';
import { TransferrableMutationRecord } from '../../transfer/TransferrableRecord';

export class LongTaskProcessor {
  private onLongTask: LongTaskFunction | null;
  private currentResolver: Function | null;
  private index: number;

  constructor(callbacks?: WorkerCallbacks) {
    this.onLongTask = (callbacks && callbacks.onLongTask) || null;
    this.currentResolver = null;
    this.index = 0;
  }

  isInLongTask(): boolean {
    return !!this.currentResolver;
  }

  /**
   * Process commands transfered from worker thread to main thread.
   * @param mutation mutation record containing commands to execute.
   */
  processStart = (mutation?: TransferrableMutationRecord): void => {
    if (!this.onLongTask) {
      return;
    }
    this.index++;
    if (!this.currentResolver) {
      this.onLongTask(
        new Promise(resolve => {
          this.currentResolver = resolve;
        }),
      );
    }
  };

  /**
   * Process commands transfered from worker thread to main thread.
   * @param mutation mutation record containing commands to execute.
   */
  processEnd = (mutation?: TransferrableMutationRecord): void => {
    if (!this.onLongTask) {
      return;
    }
    this.index--;
    if (this.currentResolver && this.index <= 0) {
      this.currentResolver();
      this.currentResolver = null;
      this.index = 0;
    }
  };
}
