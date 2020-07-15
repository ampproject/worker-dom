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
import { HydrateableNode } from '../transfer/TransferrableNodes';
import { DefaultAllowedMutations, TransferrableMutationType } from '../transfer/TransferrableMutation';
import { CommandExecutor } from './commands/interface';
import { LongTaskExecutor } from './commands/long-task';
import { ChildListProcessor } from './commands/child-list';
import { AttributeProcessor } from './commands/attribute';
import { CharacterDataProcessor } from './commands/character-data';
import { PropertyProcessor } from './commands/property';
import { EventSubscriptionProcessor } from './commands/event-subscription';
import { BoundingClientRectProcessor } from './commands/bounding-client-rect';
import { OffscreenCanvasProcessor } from './commands/offscreen-canvas';
import { ObjectMutationProcessor } from './commands/object-mutation';
import { ObjectCreationProcessor } from './commands/object-creation';
import { ImageBitmapProcessor } from './commands/image-bitmap';
import { StorageProcessor } from './commands/storage';
import { FunctionProcessor } from './commands/function';
import { StringContext } from './strings';
import { NodeContext } from './nodes';
import { WorkerContext } from './worker';
import { ObjectContext } from './object-context';

/**
 * The callback for `mutationPump`. If specified, this callback will be called
 * for the new set of mutations pending. The callback can either immediately
 * call `flush()`, or it can reject mutations, or it can batch them further.
 */
export type MutationPumpFunction = (flush: Function, phase: Phase) => void;

export type LongTaskFunction = (promise: Promise<any>) => void;

export type HydrationFilterPredicate = (node: RenderableElement) => boolean;

export interface InboundWorkerDOMConfiguration {
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
  // Hydration Filter Predicate
  hydrateFilter?: HydrationFilterPredicate;
  // Executor Filter, allow list
  executorsAllowed?: Array<number>;

  // ---- Optional Callbacks
  // Called when worker consumes the page's initial DOM state.
  onCreateWorker?: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => void;
  // Called before a message is sent to the worker.
  onSendMessage?: (message: MessageToWorker) => void;
  // Called after a message is received from the worker.
  onReceiveMessage?: (message: MessageFromWorker) => void;
}

export interface WorkerDOMConfiguration {
  // ---- Required Values.
  authorURL: string;
  domURL: string;

  // ---- Optional, with defaults
  // Schedules mutation phase.
  mutationPump: MutationPumpFunction;
  // Executor Filter, allow list
  executorsAllowed: Array<number>;
  // Executors: the list of executors to apply
  executors: { [key: number]: CommandExecutor };

  // ---- Optional Overrides
  // Schedules long task.
  longTask?: LongTaskFunction;
  // Sanitizer for DOM Mutations
  sanitizer?: Sanitizer;
  // Hydration Filter Predicate
  hydrateFilter?: HydrationFilterPredicate;

  // ---- Optional Callbacks
  // Called when worker consumes the page's initial DOM state.
  onCreateWorker?: (initialDOM: RenderableElement, strings: Array<string>, skeleton: HydrateableNode, keys: Array<string>) => void;
  // Called before a message is sent to the worker.
  onSendMessage?: (message: MessageToWorker) => void;
  // Called after a message is received from the worker.
  onReceiveMessage?: (message: MessageFromWorker) => void;
}

export function normalizeConfiguration(
  config: InboundWorkerDOMConfiguration,
  executors: { [index: number]: CommandExecutor },
): WorkerDOMConfiguration {
  return Object.assign(
    {
      mutationPump: requestAnimationFrame.bind(null),
      executorsAllowed: DefaultAllowedMutations,
      executors,
    },
    config,
  );
}

export const getLiteProcessors = (args: [StringContext, NodeContext, WorkerContext, ObjectContext, WorkerDOMConfiguration]) => {
  return {
    [TransferrableMutationType.FUNCTION_CALL]: FunctionProcessor.apply(null, args),
  };
};

export const getAllProcessors = (args: [StringContext, NodeContext, WorkerContext, ObjectContext, WorkerDOMConfiguration]) => {
  const sharedLongTaskProcessor = LongTaskExecutor.apply(null, args);
  return {
    [TransferrableMutationType.CHILD_LIST]: ChildListProcessor.apply(null, args),
    [TransferrableMutationType.ATTRIBUTES]: AttributeProcessor.apply(null, args),
    [TransferrableMutationType.CHARACTER_DATA]: CharacterDataProcessor.apply(null, args),
    [TransferrableMutationType.PROPERTIES]: PropertyProcessor.apply(null, args),
    [TransferrableMutationType.EVENT_SUBSCRIPTION]: EventSubscriptionProcessor.apply(null, args),
    [TransferrableMutationType.GET_BOUNDING_CLIENT_RECT]: BoundingClientRectProcessor.apply(null, args),
    [TransferrableMutationType.LONG_TASK_START]: sharedLongTaskProcessor,
    [TransferrableMutationType.LONG_TASK_END]: sharedLongTaskProcessor,
    [TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE]: OffscreenCanvasProcessor.apply(null, args),
    [TransferrableMutationType.OBJECT_MUTATION]: ObjectMutationProcessor.apply(null, args),
    [TransferrableMutationType.OBJECT_CREATION]: ObjectCreationProcessor.apply(null, args),
    [TransferrableMutationType.IMAGE_BITMAP_INSTANCE]: ImageBitmapProcessor.apply(null, args),
    [TransferrableMutationType.STORAGE]: StorageProcessor.apply(null, args),
    [TransferrableMutationType.FUNCTION_CALL]: FunctionProcessor.apply(null, args),
  };
};
