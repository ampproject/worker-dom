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
import * as sinon from 'sinon';
import { serialize } from '../worker-thread/serialize';
import { TransferrableArgs } from '../transfer/TransferrableArgs';
import { store } from '../worker-thread/strings';
import { CanvasGradientFake } from '../worker-thread/canvas/CanvasGradientFake';

const test = anyTest as TestInterface<{}>;

test('Serializes Integers', t => {
  const serialized = serialize([1]);
  t.deepEqual(serialized, [TransferrableArgs.SmallInt, 1]);
});

test('Serializes Floats', t => {
  const serialized = serialize([1.23]);
  t.deepEqual(serialized[0], TransferrableArgs.Float);

  // don't like implementing behavior but is there a better way to do this?
  const u16 = new Uint16Array([serialized[1], serialized[2]]);
  const f32 = new Float32Array(u16.buffer);
  t.true(approx(f32[0], 1.23));
});

test('Serializes Strings', t => {
  const serialized = serialize(['hello']);
  t.deepEqual(serialized, [TransferrableArgs.String, store('hello')]);
});

test('Serializes Arrays', t => {
  const serialized = serialize([[1, 2, 3]]);
  t.deepEqual(serialized, [TransferrableArgs.Array, 3 /* array length */, ...serialize([1, 2, 3])]);
});

test('Serializes transferable objects', t => {
  // use a CanvasGradient as an example
  const gradient = {} as CanvasGradientFake;

  // property must exist before sinon lets us stub it
  gradient['serialize'] = () => [];

  // stub must return a value, otherwise creation processor will thow when attempting to store
  const objectSerializeStub = sinon.stub(gradient, 'serialize').returns([]);

  serialize([gradient]);
  t.true(objectSerializeStub.calledOnce);
});

/**
 * Will consider two floating point values equal if they're approximate enough.
 * @param expected
 * @param actual
 */
function approx(expected: number, actual: number): boolean {
  const diff = Math.abs(expected - actual);
  return diff < 0.001;
}