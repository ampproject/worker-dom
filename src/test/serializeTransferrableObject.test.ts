import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';
import { serializeTransferrableObject } from '../worker-thread/serializeTransferrableObject';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { store } from '../worker-thread/strings';
import { CanvasGradient } from '../worker-thread/canvas/CanvasGradient';
import { TransferrableKeys } from '../transfer/TransferrableKeys';

const test = anyTest as TestInterface<{}>;

test('Serializes Integers', (t) => {
  const serialized = serializeTransferrableObject([1]);
  t.deepEqual(serialized, [TransferrableObjectType.SmallInt, 1]);
});

test('Serializes Floats', (t) => {
  const serialized = serializeTransferrableObject([1.23]);
  t.deepEqual(serialized, [TransferrableObjectType.Float, 28836, 16285]);
});

test('Serializes Strings', (t) => {
  const serialized = serializeTransferrableObject(['hello']);
  t.deepEqual(serialized, [TransferrableObjectType.String, store('hello')]);
});

test('Serializes Arrays', (t) => {
  const serialized = serializeTransferrableObject([[1, 2, 3]]);
  t.deepEqual(serialized, [TransferrableObjectType.Array, 3 /* array length */, ...serializeTransferrableObject([1, 2, 3])]);
});

test('Serializes Transferable Objects', (t) => {
  // use a CanvasGradient as an example
  const gradient = {} as CanvasGradient;

  // property must exist before sinon lets us stub it
  gradient[TransferrableKeys.serializeAsTransferrableObject] = () => [];

  // stub must return a value, otherwise object-creation processor will thow when attempting to store
  const fakeSerializedObject = [1, 2, 3, 4] as number[];
  const objectSerializeStub = sinon.stub(gradient, TransferrableKeys.serializeAsTransferrableObject).returns(fakeSerializedObject);
  const serialized = serializeTransferrableObject([gradient]);

  t.true(objectSerializeStub.calledOnce);
  t.deepEqual(serialized, fakeSerializedObject);
});
