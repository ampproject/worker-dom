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
import { Strings } from '../../main-thread/strings';
import { NodeContext } from '../../main-thread/nodes';
import { Env } from './helpers/env';
import { ObjectContext } from '../../main-thread/object-context';

const test = anyTest as TestInterface<{
  strings: Strings;
  nodeContext: NodeContext;
  objectContext: ObjectContext;
}>;

test.beforeEach(t => {
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');

  const strings = new Strings();
  const objectContext = new ObjectContext();
  const nodeContext = new NodeContext(strings, baseElement);

  t.context = {
    strings,
    nodeContext,
    objectContext,
  };
});

test('Deserializes int arguments', t => {
  const { strings, nodeContext } = t.context;

  const serializedArgs = [TransferrableObjectType.SmallInt, 1];
  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, strings, nodeContext);

  t.is(deserializedArgs[0], 1);
});

test('Deserializes float arguments', t => {
  const { strings, nodeContext } = t.context;

  const f32 = new Float32Array(1);
  const u16 = new Uint16Array(f32.buffer);
  f32[0] = 1.23;

  const serializedArgs = [TransferrableObjectType.Float, u16[0], u16[1]];
  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, strings, nodeContext);

  t.true(approx(1.23, deserializedArgs[0] as number));
});

test('Deserializes string arguments', t => {
  const { strings, nodeContext } = t.context;

  const serializedArgs = [TransferrableObjectType.String, storeString(strings, 'textArg')];
  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, strings, nodeContext);

  t.is(deserializedArgs[0], 'textArg');
});

test('Deserializes array argument', t => {
  const { strings, nodeContext } = t.context;

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
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, strings, nodeContext);

  t.deepEqual(deserializedArgs[0], [1, 2, 3]);
});

test('Deserializes object argument', t => {
  const { strings, nodeContext, objectContext } = t.context;

  const id = 5; // example object id
  const obj = {} as CanvasGradient;
  objectContext.store(id, obj);

  const serializedArgs = [TransferrableObjectType.TransferObject, id];
  const buffer = new Uint16Array(serializedArgs);
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 1, strings, nodeContext, objectContext);

  t.is(deserializedArgs[0], obj);
});

test('Deserializes varying types', t => {
  const { strings, nodeContext, objectContext } = t.context;

  // argument 1: SmallInt
  const smallInt = 1;

  // argument 2: String
  const stringArg = 'textArg';
  const stringId = storeString(strings, stringArg);

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

  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 0, 3, strings, nodeContext, objectContext);

  t.is(deserializedArgs[0], smallInt);
  t.is(deserializedArgs[1], stringArg);
  t.is(deserializedArgs[2], object);
});

test('Deserializes from different offset', t => {
  const { strings, nodeContext } = t.context;

  const serializedArgs = [TransferrableObjectType.SmallInt, 1];
  const buffer = new Uint16Array([1, 2, 3].concat(serializedArgs));
  const { args: deserializedArgs } = deserializeTransferrableObject(buffer, 3, 1, strings, nodeContext);

  t.is(deserializedArgs[0], 1);
});

test('Returns the correct end offset', t => {
  const { strings, nodeContext } = t.context;

  const serializedArgs = [TransferrableObjectType.SmallInt, 1, TransferrableObjectType.SmallInt, 2];
  const buffer = new Uint16Array([1, 2, 3].concat(serializedArgs));

  const startOffset = 3;
  const { offset: endOffset } = deserializeTransferrableObject(buffer, startOffset, 2, strings, nodeContext);

  t.is(endOffset, startOffset + 4);
});

// main-thread's strings API does not return an ID when storing a string
// so for convenience:
function storeString(strings: Strings, text: string, currentIndex = -1) {
  strings.store(text);
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
