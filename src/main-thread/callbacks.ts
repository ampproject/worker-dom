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
import { TransferrablePhase } from '../transfer/TransferrablePhase';

export type MutationPumpFunction = (callback: Function, phase: TransferrablePhase) => void;

export interface WorkerCallbacks {
  // Called when worker consumes the page's initial DOM state.
  onCreateWorker?: (initialDOM: RenderableElement) => void;
  // Called when the worker is hydrated (sends a HYDRATE message).
  onHydration?: () => void;
  // Called before a message is sent to the worker.
  onSendMessage?: (message: MessageToWorker) => void;
  // Called after a message is received from the worker.
  onReceiveMessage?: (message: MessageFromWorker) => void;
  // Called to schedule mutation phase.
  onMutationPump?: MutationPumpFunction;
}
