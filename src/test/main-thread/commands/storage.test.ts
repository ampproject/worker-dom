/**
 * Copyright 2021 The AMP HTML Authors. All Rights Reserved.
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

import anyTest, { TestInterface } from 'ava';
import { StorageProcessor } from '../../../main-thread/commands/storage';
import { StringContext } from '../../../main-thread/strings';
import { WorkerDOMConfiguration } from '../../../main-thread/configuration';
import { CommandExecutor } from '../../../main-thread/commands/interface';
import {
  TransferrableMutationType,
  StorageMutationIndex,
} from '../../../transfer/TransferrableMutation';
import { StorageLocation } from '../../../transfer/TransferrableStorage';
import {
  GetOrSet,
  MessageToWorker,
  MessageType,
  StorageValueToWorker,
} from '../../../transfer/Messages';
import { WorkerContext } from '../../../main-thread/worker';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{}>;

function getStorageProcessor(
  strings: string[],
): {
  processor: CommandExecutor;
  messages: Array<MessageToWorker>;
} {
  const stringCtx = new StringContext();
  stringCtx.storeValues(strings);
  const messages: Array<MessageToWorker> = [];

  const processor = StorageProcessor(
    stringCtx,
    undefined as any,
    {
      messageToWorker(m) {
        messages.push(m);
      },
    } as WorkerContext,
    undefined as any,
    {
      executorsAllowed: [TransferrableMutationType.STORAGE],
      sanitizer: ({
        getStorage() {
          return Promise.resolve({ hello: 'world' });
        },
      } as unknown) as Sanitizer,
    } as WorkerDOMConfiguration,
  );
  return {
    processor,
    messages,
  };
}

test('StorageProcessor sends storage value event to worker', async (t) => {
  const { processor, messages } = getStorageProcessor(['key']);
  const mutation: number[] = [];
  mutation[StorageMutationIndex.Operation] = GetOrSet.GET;
  mutation[StorageMutationIndex.Location] = StorageLocation.AmpState;
  mutation[StorageMutationIndex.Key] = 0;
  const mutations = new Uint16Array(mutation);

  processor.execute(mutations, 0, true);
  await Promise.resolve(setTimeout);

  const expectedMessage: StorageValueToWorker = {
    [TransferrableKeys.type]: MessageType.GET_STORAGE,
    [TransferrableKeys.storageKey]: 'key',
    [TransferrableKeys.storageLocation]: StorageLocation.AmpState,
    [TransferrableKeys.value]: { hello: 'world' },
  };
  t.is(messages.length, 1);
  t.deepEqual(messages, [expectedMessage]);
});
