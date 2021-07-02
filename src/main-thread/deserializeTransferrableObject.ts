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

import { StringContext } from './strings';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { NodeContext } from './nodes';
import { ObjectContext } from './object-context';

interface DeserializedArgs {
  args: unknown[];
  offset: number;
}

const f32 = new Float32Array(1);
const u16 = new Uint16Array(f32.buffer);

/**
 * Deserializes TransferrableObjectType arguments.
 * @param buffer Contains mutation with arguments to deserialize.
 * @param offset Start position of arguments in mutations buffer.
 * @param count Number of arguments to deserialize.
 * @param stringContext Strings context.
 * @param nodeContext Nodes context.
 * @param objectContext Objects context
 */
export function deserializeTransferrableObject(
  buffer: Uint16Array,
  offset: number,
  count: number,
  stringContext: StringContext,
  nodeContext: NodeContext,
  objectContext?: ObjectContext,
): DeserializedArgs {
  const args: unknown[] = [];
  for (let i = 0; i < count; i++) {
    switch (buffer[offset++] as TransferrableObjectType) {
      case TransferrableObjectType.SmallInt:
        args.push(buffer[offset++]);
        break;

      case TransferrableObjectType.Float:
        u16[0] = buffer[offset++];
        u16[1] = buffer[offset++];
        args.push(f32[0]);
        break;

      case TransferrableObjectType.String:
        args.push(stringContext.get(buffer[offset++]));
        break;

      case TransferrableObjectType.Array:
        const size = buffer[offset++];
        const des = deserializeTransferrableObject(buffer, offset, size, stringContext, nodeContext, objectContext);
        args.push(des.args);
        offset = des.offset;
        break;

      case TransferrableObjectType.TransferObject:
        if (!objectContext) {
          throw new Error('objectContext not provided.');
        }

        args.push(objectContext.get(buffer[offset++]));
        break;

      case TransferrableObjectType.CanvasRenderingContext2D:
        const canvas = nodeContext.getNode(buffer[offset++]) as HTMLCanvasElement;
        args.push(canvas.getContext('2d'));
        break;

      case TransferrableObjectType.HTMLElement:
        args.push(nodeContext.getNode(buffer[offset++]));
        break;

      default:
        throw new Error('Cannot deserialize argument.');
    }
  }
  return {
    args,
    offset,
  };
}
