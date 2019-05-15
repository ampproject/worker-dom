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

import { WorkerDOMConfiguration } from '../configuration';
import { Strings } from '../strings';
import { NodeContext } from '../nodes';
import { WorkerContext } from '../worker';

export interface CommandExecutor {
  execute(mutations: Uint16Array, startPosition: number, target: RenderableElement): number;
  print(mutations: Uint16Array, startPosition: number, target?: RenderableElement | null): Object;
}

export interface CommandExecutorInterface {
  (strings: Strings, nodeContext: NodeContext, workerContext: WorkerContext, config: WorkerDOMConfiguration): CommandExecutor;
}
