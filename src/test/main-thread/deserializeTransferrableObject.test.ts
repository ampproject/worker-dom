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

import anyTest, { TestInterface } from 'ava';
import { TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { deserializeTransferrableObject } from '../../main-thread/deserializeTransferrableObject';
import { StringContext } from '../../main-thread/strings';
import { NodeContext } from '../../main-thread/nodes';
import { Env } from './helpers/env';
import { ObjectContext } from '../../main-thread/object-context';

const test = anyTest as TestInterface<{
  stringContext: StringContext;
  nodeContext: NodeContext;
  objectContext: ObjectContext;
}>;

test.beforeEach(t => {
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');

  const stringContext = new StringContext();
  const objectContext = new ObjectContext();
  const nodeContext = new NodeContext(stringContext, baseElement);

  t.context = {
    stringContext,
    nodeContext,
    objectContext,
  };
});

test('Deserializes int arguments', t => {
  const { stringContext, nodeContext } = t.context;

  const serializedArgs = [TransferrableObjectType.SmallInt, 1];
  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, stringContext, nodeContext);

  t.deepEqual(deserializedArgs, [1]);
});

test('Deserializes float arguments', t => {
  const { stringContext, nodeContext } = t.context;

  const f32 = new Float32Array(1);
  const u16 = new Uint16Array(f32.buffer);
  f32[0] = 1.23;

  const serializedArgs = [TransferrableObjectType.Float, u16[0], u16[1]];
  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, stringContext, nodeContext);

  t.true(approx(1.23, deserializedArgs[0] as number));
});

test('Deserializes string arguments', t => {
  const { stringContext, nodeContext } = t.context;

  const serializedArgs = [TransferrableObjectType.String, storeString(stringContext, 'textArg')];
  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, stringContext, nodeContext);

  t.deepEqual(deserializedArgs, ['textArg']);
});

test('Deserializes array argument', t => {
  const { stringContext, nodeContext } = t.context;

  const serializedArgs = [
    TransferrableObjectType.Array,
    3,
    TransferrableObjectType.SmallInt,
    1,
    TransferrableObjectType.SmallInt,
    2,
    TransferrableObjectType.SmallInt,
    3,
  ];

  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, stringContext, nodeContext);

  t.deepEqual(deserializedArgs, [[1, 2, 3]]);
});

test('Deserializes object argument', t => {
  const { stringContext, nodeContext, objectContext } = t.context;

  const id = 5; // example object id
  const obj = {} as CanvasGradient;
  objectContext.store(id, obj);

  const serializedArgs = [TransferrableObjectType.TransferObject, id];
  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, stringContext, nodeContext, objectContext);

  t.deepEqual(deserializedArgs, [obj]);
});

test('Deserializes varying types', t => {
  const { stringContext, nodeContext, objectContext } = t.context;

  // argument 1: SmallInt
  const smallInt = 1;

  // argument 2: String
  const stringArg = 'textArg';
  const stringId = storeString(stringContext, stringArg);

  // argument 3: Object
  const objectId = 7;
  const object = {} as CanvasGradient;
  objectContext.store(objectId, object);

  const serializedArgs = [
    TransferrableObjectType.SmallInt,
    smallInt,
    TransferrableObjectType.String,
    stringId,
    TransferrableObjectType.TransferObject,
    objectId,
  ];
  const buffer = new Uint16Array(serializedArgs);

  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 3, stringContext, nodeContext, objectContext);

  t.deepEqual(deserializedArgs, [smallInt, stringArg, object]);
});

test('Deserializes from different offset', t => {
  const { stringContext, nodeContext } = t.context;

  const serializedArgs = [TransferrableObjectType.SmallInt, 1];
  const buffer = new Uint16Array([1, 2, 3].concat(serializedArgs));
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 3, 1, stringContext, nodeContext);

  t.deepEqual(deserializedArgs, [1]);
});

test('Returns the correct end offset', t => {
  const { stringContext, nodeContext } = t.context;

  const serializedArgs = [
    TransferrableObjectType.SmallInt,
    1,
    TransferrableObjectType.SmallInt,
    2,

    // add a value at the end of the array, to test correctness of end offset
    32,
  ];

  const buffer = new Uint16Array([1, 2, 3].concat(serializedArgs));
  const { offset: endOffset } = deserializeTransferrableObject(buffer, 3, 2, stringContext, nodeContext);

  t.is(buffer[endOffset], 32);
});

// main-thread's strings API does not return an ID when storing a string
// so for convenience:
function storeString(stringContext: StringContext, text: string, currentIndex = -1) {
  stringContext.store(text);
  return ++currentIndex;
}

/**
 * Used to compare float value similarity in tests.
 * @param expected
 */
function approx(expected: number, actual: number): boolean {
  const diff = Math.abs(expected - actual);
  return diff < 0.001;
}
