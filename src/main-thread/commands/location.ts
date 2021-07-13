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

import { CommandExecutorInterface } from './interface';
import {
  TransferrableMutationType,
  LocationMutationIndex
} from '../../transfer/TransferrableMutation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType, LocationToWorker, GetOrSet } from '../../transfer/Messages';
import { Location } from '../../worker-thread/dom/Location';

export const LocationProcessor: CommandExecutorInterface = (strings, nodeContext, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.LOCATION);

  const get = (): void => {
    if (config.sanitizer) {
      config.sanitizer.getLocation().then((value: Location) => {
        const message: LocationToWorker = {
          [TransferrableKeys.type]: MessageType.LOCATION,
          [TransferrableKeys.location]: value,
        };
        workerContext.messageToWorker(message);
      });
    } else {
      console.error(`LOCATION: Sanitizer not found`);
    }
  };

  const set = (location: string): void => {
    if (config.sanitizer) {
      config.sanitizer.setLocation(location);
    } else {
      window.location.href = location;
    }
  };

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const operation = mutations[startPosition + LocationMutationIndex.Operation];
        const locationIndex = mutations[startPosition + LocationMutationIndex.Location];

        const location = strings.get(locationIndex);

        if (operation === GetOrSet.GET) {
          get();
        } else if (operation === GetOrSet.SET) {
          set(location);
        }
      }

      return startPosition + LocationMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const operation = mutations[startPosition + LocationMutationIndex.Operation];
      const location = mutations[startPosition + LocationMutationIndex.Location];

      return {
        type: 'LOCATION',
        operation,
        location,
        allowedExecution,
      };
    },
  };
};
