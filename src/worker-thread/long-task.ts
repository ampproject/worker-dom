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

import { Document } from './dom/Document';
import { MutationRecordType } from './MutationRecord';
import { mutate } from './MutationObserver';

export class LongTask {
  private doc: Document;

  constructor(doc: Document) {
    this.doc = doc;
  }

  private execute(promise: Promise<any>, message?: string): Promise<any> {
    // Start the task.
    mutate({ type: MutationRecordType.LONG_TASK_START, target: this.doc });
    return promise.then(
      result => {
        // Complete the task.
        mutate({ type: MutationRecordType.LONG_TASK_END, target: this.doc });
        return result;
      },
      reason => {
        // Complete the task.
        mutate({ type: MutationRecordType.LONG_TASK_END, target: this.doc });
        throw reason;
      },
    );
  }

  wrap(func: Function): Function {
    const longTask = this;
    return function() {
      return longTask.execute(Promise.resolve(func.apply(null, arguments)));
    };
  }
}
