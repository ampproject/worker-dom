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

import { MessageFromWorker, MessageToWorker } from '../transfer/Messages';
import { Phase } from '../transfer/Phase';

/**
 * The callback for `onMutationPump`. If specified, this callback will be called
 * for the new set of mutations pending. The callback can either immediately
 * call `flush()`, or it can reject mutations, or it can batch them further.
 */
export type MutationPumpFunction = (flush: Function, phase: Phase) => void;

export type LongTaskFunction = (promise: Promise<any>) => void;

export interface WorkerDOMConfiguration {
  // ---- Required Values.
  authorURL: string;
  domURL: string;

  // ---- Optional Overrides
  // Schedules mutation phase.
  mutationPump?: MutationPumpFunction;
  // Schedules long task.
  longTask?: LongTaskFunction;
  // Sanitizer for DOM Mutations
  sanitizer?: Sanitizer;

  // ---- Optional Callbacks
  // Called when worker consumes the page's initial DOM state.
  onCreateWorker?: (initialDOM: RenderableElement) => void;
  // Called when the worker is hydrated (sends a HYDRATE message).
  onHydration?: () => void;
  // Called before a message is sent to the worker.
  onSendMessage?: (message: MessageToWorker) => void;
  // Called after a message is received from the worker.
  onReceiveMessage?: (message: MessageFromWorker) => void;
}
