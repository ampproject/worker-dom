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

import { store } from './strings';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { Serializable, TransferrableObject } from './worker-thread';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

const f32 = new Float32Array(1);
const u16 = new Uint16Array(f32.buffer);

function isSmallInt(num: number): boolean {
  u16[0] = num;
  // If the Uint16Array doesn't coerce it to another value, that means it fits
  // into a Uint16Array.
  return u16[0] === num;
}

/**
 * Serializes arguments into a Uint16 compatible format.
 *
 * The serialization format uses a variable length tuple, with the first item
 * being the encoded representation's type and any number of values afterwards.
 *
 * @param args The arguments to serialize
 */
export function serializeTransferrableObject(args: Serializable[]): number[] {
  const serialized: number[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (typeof arg === 'number') {
      if (isSmallInt(arg)) {
        serialized.push(TransferrableObjectType.SmallInt, arg);
      } else {
        f32[0] = arg;
        serialized.push(TransferrableObjectType.Float, u16[0], u16[1]);
      }
      continue;
    }

    if (typeof arg === 'string') {
      serialized.push(TransferrableObjectType.String, store(arg));
      continue;
    }

    if (Array.isArray(arg)) {
      serialized.push(TransferrableObjectType.Array, arg.length);
      const serializedArray = serializeTransferrableObject(arg);

      for (let i = 0; i < serializedArray.length; i++) {
        serialized.push(serializedArray[i]);
      }

      continue;
    }

    if (typeof arg === 'object') {
      const serializedObject = (arg as TransferrableObject)[TransferrableKeys.serializeAsTransferrableObject]();

      for (let i = 0; i < serializedObject.length; i++) {
        serialized.push(serializedObject[i]);
      }

      continue;
    }

    throw new Error('Cannot serialize argument.');
  }

  return serialized;
}
