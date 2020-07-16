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

import { TransferrableMutationType } from '../transfer/TransferrableMutation';
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

export function getAllProcessors() {
  const sharedLongTaskProcessor = LongTaskExecutor;
  return {
    [TransferrableMutationType.CHILD_LIST]: ChildListProcessor,
    [TransferrableMutationType.ATTRIBUTES]: AttributeProcessor,
    [TransferrableMutationType.CHARACTER_DATA]: CharacterDataProcessor,
    [TransferrableMutationType.PROPERTIES]: PropertyProcessor,
    [TransferrableMutationType.EVENT_SUBSCRIPTION]: EventSubscriptionProcessor,
    [TransferrableMutationType.GET_BOUNDING_CLIENT_RECT]: BoundingClientRectProcessor,
    [TransferrableMutationType.LONG_TASK_START]: sharedLongTaskProcessor,
    [TransferrableMutationType.LONG_TASK_END]: sharedLongTaskProcessor,
    [TransferrableMutationType.OFFSCREEN_CANVAS_INSTANCE]: OffscreenCanvasProcessor,
    [TransferrableMutationType.OBJECT_MUTATION]: ObjectMutationProcessor,
    [TransferrableMutationType.OBJECT_CREATION]: ObjectCreationProcessor,
    [TransferrableMutationType.IMAGE_BITMAP_INSTANCE]: ImageBitmapProcessor,
    [TransferrableMutationType.STORAGE]: StorageProcessor,
    [TransferrableMutationType.FUNCTION_CALL]: FunctionProcessor,
  };
}
