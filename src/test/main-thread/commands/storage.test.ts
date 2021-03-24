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
import { TransferrableMutationType, StorageMutationIndex } from '../../../transfer/TransferrableMutation';
import { StorageLocation } from '../../../transfer/TransferrableStorage';
import { GetOrSet, MessageToWorker } from '../../../transfer/Messages';
import { WorkerContext } from '../../../main-thread/worker';

const test = anyTest as TestInterface<{}>;

function getStorageProcessor(strings: string[]): { processor: CommandExecutor; messages: Array<MessageToWorker> } {
  const stringCtx = new StringContext();
  stringCtx.storeValues(strings);
  const messages: Array<MessageToWorker> = [];
  const processor = StorageProcessor(
    stringCtx,
    undefined as any,
    {
      messageToWorker(msg) {
        messages.push(msg);
      },
    } as WorkerContext,
    undefined as any,
    {
      executorsAllowed: [TransferrableMutationType.FUNCTION_CALL],
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
  const mutations: number[] = [];
  mutations[StorageMutationIndex.Operation] = GetOrSet.GET;
  mutations[StorageMutationIndex.Location] = StorageLocation.AmpState;
  mutations[StorageMutationIndex.Key] = 0;

  processor.execute(new Uint16Array(mutations), 0, true);
  t.deepEqual(messages, []);
});
