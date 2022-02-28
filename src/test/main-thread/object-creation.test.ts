import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';
import { StringContext } from '../../main-thread/strings';
import { ObjectContext } from '../../main-thread/object-context';
import { CommandExecutor } from '../../main-thread/commands/interface';
import { Env } from './helpers/env';
import { NodeContext } from '../../main-thread/nodes';
import { WorkerContext } from '../../main-thread/worker';
import { ObjectCreationProcessor } from '../../main-thread/commands/object-creation';
import { normalizeConfiguration } from '../../main-thread/configuration';
import { TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

const test = anyTest as TestInterface<{
  stringContext: StringContext;
  objectContext: ObjectContext;
  objectCreationProcessor: CommandExecutor;
  sandbox: sinon.SinonSandbox;
  canvasElement: HTMLCanvasElement;
}>;

test.beforeEach((t) => {
  const sandbox = sinon.createSandbox();
  const stringContext = new StringContext();
  const objectContext = new ObjectContext();

  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');

  const nodeContext = new NodeContext(stringContext, baseElement);
  const workerContext = {
    getWorker() {},
    messageToWorker() {},
  } as unknown as WorkerContext;

  const objectCreationProcessor = ObjectCreationProcessor(
    stringContext,
    nodeContext,
    workerContext,
    objectContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
    }),
  );

  const ctx = {} as CanvasRenderingContext2D;
  const canvasElement = {
    _index_: 1,
    getContext: (c: string) => ctx,
  } as unknown as HTMLCanvasElement;
  sandbox.stub(nodeContext, 'getNode').returns(canvasElement);

  t.context = {
    stringContext,
    objectContext,
    objectCreationProcessor,
    sandbox,
    canvasElement,
  };
});

test('Object creation with mutation at a zero offset', (t) => {
  const { stringContext, objectContext, objectCreationProcessor, sandbox, canvasElement } = t.context;

  const targetObject = canvasElement.getContext('2d');
  const methodName = 'createLinearGradient';

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());

  // use a CanvasGradient as an example
  const gradientObject = {};
  stub.returns(gradientObject);

  const objectId = 111; // give a sample id
  t.throws(() => objectContext.get(objectId));

  const serializedTarget = [TransferrableObjectType.CanvasRenderingContext2D, canvasElement._index_];
  const serializedArgs = [
    TransferrableObjectType.SmallInt,
    1,
    TransferrableObjectType.SmallInt,
    2,
    TransferrableObjectType.SmallInt,
    3,
    TransferrableObjectType.SmallInt,
    4,
  ];

  objectCreationProcessor.execute(
    new Uint16Array([
      TransferrableMutationType.OBJECT_CREATION,
      stringContext.store(methodName),
      objectId,
      4, // arg count
      ...serializedTarget,
      ...serializedArgs,
    ]),
    0,
    /* allow */ true,
  );

  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
  t.is(objectContext.get(objectId), gradientObject);
});

test('Object creation with mutation at non-zero offset', (t) => {
  const { stringContext, objectContext, objectCreationProcessor, sandbox, canvasElement } = t.context;

  const targetObject = canvasElement.getContext('2d');
  const methodName = 'createLinearGradient';

  if (!targetObject) {
    throw new Error('targetObject is not defined');
  }

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());

  // use a CanvasGradient as an example
  const gradientObject = {};
  stub.returns(gradientObject);

  const objectId = 111; // give a sample id

  const serializedTarget = [TransferrableObjectType.CanvasRenderingContext2D, canvasElement._index_];
  const serializedArgs = [
    TransferrableObjectType.SmallInt,
    1,
    TransferrableObjectType.SmallInt,
    2,
    TransferrableObjectType.SmallInt,
    3,
    TransferrableObjectType.SmallInt,
    4,
  ];

  const mutation = [
    TransferrableMutationType.OBJECT_CREATION,
    stringContext.store(methodName),
    objectId,
    4, // arg count
    ...serializedTarget,
    ...serializedArgs,
  ];

  // add three values to the start of the mutation and change the offset
  const mutationsArray = new Uint16Array([1, 2, 3].concat(mutation));
  objectCreationProcessor.execute(mutationsArray, 3, /* allow */ true);

  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
  t.is(objectContext.get(objectId), gradientObject);
});

test('Returns correct end offset', (t) => {
  const { stringContext, objectCreationProcessor, canvasElement, sandbox } = t.context;

  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const methodName = 'fillRect';
  (targetObject[methodName] as sinon.SinonStub) = sandbox.stub();
  const serializedArgs = [
    TransferrableObjectType.SmallInt,
    1,
    TransferrableObjectType.SmallInt,
    2,
    TransferrableObjectType.SmallInt,
    3,
    TransferrableObjectType.SmallInt,
    4,
  ];

  const mutation = [
    TransferrableMutationType.OBJECT_CREATION,
    stringContext.store(methodName),
    1, // object ID (not important for this test)
    4, // arg count
    TransferrableObjectType.CanvasRenderingContext2D,
    canvasElement._index_,
    ...serializedArgs,

    // add an extra value after the OBJECT_MUTATION, which should be at end offset after processing
    32,
  ];

  const mutationsArray = new Uint16Array([1, 2, 3].concat(mutation));
  const endOffset = objectCreationProcessor.execute(mutationsArray, 3, /* allow */ true);

  t.is(mutationsArray[endOffset], 32);
});
