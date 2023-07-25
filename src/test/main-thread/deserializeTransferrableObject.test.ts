import anyTest, { TestInterface } from 'ava';
import { TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { deserializeTransferableMessage } from '../../main-thread/deserializeTransferrableObject';
import { StringContext } from '../../main-thread/strings';
import { NodeContext } from '../../main-thread/nodes';
import { Env } from './helpers/env';
import { ObjectContext } from '../../main-thread/object-context';
import { BytesStream } from '../../transfer/BytesStream';
import { estimateSizeInBytes } from '../../worker-thread/serializeTransferrableObject';

const test = anyTest as TestInterface<{
  stringContext: StringContext;
  nodeContext: NodeContext;
  objectContext: ObjectContext;
}>;

test.beforeEach((t) => {
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

test('Deserializes int arguments', (t) => {
  const { stringContext, nodeContext, objectContext } = t.context;

  const buffer = new BytesStream(estimateSizeInBytes([1]));
  buffer.appendUint32(1);
  buffer.appendUint8(TransferrableObjectType.Uint8);
  buffer.appendUint8(1);

  const deserializedArgs = deserializeTransferableMessage(new BytesStream(buffer.buffer), stringContext, nodeContext, objectContext);

  t.deepEqual(deserializedArgs, [1]);
});

test('Deserializes float arguments', (t) => {
  const { stringContext, nodeContext, objectContext } = t.context;

  const buffer = new BytesStream(estimateSizeInBytes([1.23]));
  buffer.appendUint32(1);
  buffer.appendUint8(TransferrableObjectType.Float32);
  buffer.appendFloat32(1.23);

  const deserializedArgs = deserializeTransferableMessage(new BytesStream(buffer.buffer), stringContext, nodeContext, objectContext);

  t.true(approx(1.23, deserializedArgs[0] as number));
});

test('Deserializes string arguments', (t) => {
  const { stringContext, nodeContext, objectContext } = t.context;

  const buffer = new BytesStream(estimateSizeInBytes(['textArg']));
  buffer.appendUint32(1);
  buffer.appendUint8(TransferrableObjectType.String);
  buffer.appendUint16(stringContext.store('textArg'));

  const deserializedArgs = deserializeTransferableMessage(new BytesStream(buffer.buffer), stringContext, nodeContext, objectContext);
  t.deepEqual(deserializedArgs, ['textArg']);
});

test('Deserializes array argument', (t) => {
  const { stringContext, nodeContext, objectContext } = t.context;

  const args = [1, -20000, 3000000000];

  const buffer = new BytesStream(estimateSizeInBytes([args]));
  buffer.appendUint32(1);
  buffer.appendUint8(TransferrableObjectType.Array);
  buffer.appendUint32(3);
  buffer.appendUint8(TransferrableObjectType.Uint8);
  buffer.appendUint8(args[0]);
  buffer.appendUint8(TransferrableObjectType.Int16);
  buffer.appendInt16(args[1]);
  buffer.appendUint8(TransferrableObjectType.Uint32);
  buffer.appendUint32(args[2]);

  const deserializedArgs = deserializeTransferableMessage(new BytesStream(buffer.buffer), stringContext, nodeContext, objectContext);

  t.deepEqual(deserializedArgs, [args]);
});

test('Deserializes object argument', (t) => {
  const { stringContext, nodeContext, objectContext } = t.context;

  const id = 5; // example object id
  const obj = {} as CanvasGradient;
  objectContext.store(id, obj);

  const buffer = new BytesStream(10);
  buffer.appendUint32(1);
  buffer.appendUint8(TransferrableObjectType.TransferObject);
  buffer.appendUint16(id);

  const deserializedArgs = deserializeTransferableMessage(new BytesStream(buffer.buffer), stringContext, nodeContext, objectContext);

  t.deepEqual(deserializedArgs, [obj]);
});

test('Deserializes varying types', (t) => {
  const { stringContext, nodeContext, objectContext } = t.context;

  // argument 1: SmallInt
  const smallInt = 1;

  // argument 2: String
  const stringArg = 'textArg';
  const stringId = stringContext.store(stringArg);

  // argument 3: Object
  const objectId = 7;
  const object = {} as CanvasGradient;
  objectContext.store(objectId, object);

  const buffer = new BytesStream(100);
  buffer.appendUint32(3);
  buffer.appendUint8(TransferrableObjectType.Uint8);
  buffer.appendUint8(smallInt);
  buffer.appendUint8(TransferrableObjectType.String);
  buffer.appendUint16(stringId);
  buffer.appendUint8(TransferrableObjectType.TransferObject);
  buffer.appendUint16(objectId);

  const deserializedArgs = deserializeTransferableMessage(new BytesStream(buffer.buffer), stringContext, nodeContext, objectContext);

  t.deepEqual(deserializedArgs, [smallInt, stringArg, object]);
});

/**
 * Used to compare float value similarity in tests.
 * @param expected
 */
function approx(expected: number, actual: number): boolean {
  const diff = Math.abs(expected - actual);
  return diff < 0.001;
}
