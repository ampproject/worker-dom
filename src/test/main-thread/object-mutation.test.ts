import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';
import { StringContext } from '../../main-thread/strings';
import { ObjectContext } from '../../main-thread/object-context';
import { CommandExecutor } from '../../main-thread/commands/interface';
import { Env } from './helpers/env';
import { ObjectMutationProcessor } from '../../main-thread/commands/object-mutation';
import { NodeContext } from '../../main-thread/nodes';
import { WorkerContext } from '../../main-thread/worker';
import { normalizeConfiguration } from '../../main-thread/configuration';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { TransferrableObjectType } from '../../transfer/TransferrableMutation';

const test = anyTest as TestInterface<{
  sandbox: sinon.SinonSandbox;
  stringContext: StringContext;
  objectContext: ObjectContext;
  objectMutationProcessor: CommandExecutor;
  canvasElement: HTMLCanvasElement;
}>;

test.beforeEach((t) => {
  const sandbox = sinon.createSandbox();
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');

  const stringContext = new StringContext();
  const objectContext = new ObjectContext();

  const ctx = {} as CanvasRenderingContext2D;
  const canvasElement = {
    _index_: 1,
    getContext: (c: string) => ctx,
  } as unknown as HTMLCanvasElement;

  const nodeContext = new NodeContext(stringContext, baseElement);
  sandbox.stub(nodeContext, 'getNode').returns(canvasElement);
  const workerContext = {
    getWorker() {},
    messageToWorker() {},
  } as unknown as WorkerContext;

  const objectMutationProcessor = ObjectMutationProcessor(
    stringContext,
    nodeContext,
    workerContext,
    objectContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
    }),
  );

  t.context = {
    sandbox,
    stringContext,
    objectContext,
    objectMutationProcessor,
    canvasElement,
  };
});

test.afterEach((t) => {
  const { sandbox } = t.context;
  sandbox.restore();
});

test('Method call with no arguments', (t) => {
  const { sandbox, stringContext, objectMutationProcessor, canvasElement } = t.context;

  const methodName = 'stroke';
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(
    objectMutationProcessor,
    canvasElement,
    [TransferrableObjectType.CanvasRenderingContext2D, canvasElement._index_],
    methodName,
    stringContext,
    0,
    [],
  );
  t.true(stub.withArgs().calledOnce);
});

test('Method with arguments', (t) => {
  const { stringContext, objectMutationProcessor, sandbox, canvasElement } = t.context;

  const methodName = 'fillRect';
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
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(
    objectMutationProcessor,
    canvasElement,
    [TransferrableObjectType.CanvasRenderingContext2D, canvasElement._index_],
    methodName,
    stringContext,
    4,
    serializedArgs,
  );
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('Setter', (t) => {
  const { stringContext, objectMutationProcessor, sandbox, canvasElement } = t.context;

  const methodName = 'lineWidth';
  const setter = sandbox.spy();
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  // must declare property before sinon lets us stub setter
  (targetObject[methodName] as any) = 'existent';
  sandbox.stub(targetObject, methodName).set(setter);

  const serializedArg = [TransferrableObjectType.SmallInt, 5];

  executeCall(
    objectMutationProcessor,
    canvasElement,
    [TransferrableObjectType.CanvasRenderingContext2D, canvasElement._index_],
    methodName,
    stringContext,
    1,
    serializedArg,
  );
  t.true(setter.withArgs(5).calledOnce);
});

test('Method on prototype', (t) => {
  const { stringContext, objectMutationProcessor, sandbox, canvasElement } = t.context;

  const methodName = 'fillRect';
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
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const prototype = Object.getPrototypeOf(targetObject);

  const stub = ((prototype[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(
    objectMutationProcessor,
    canvasElement,
    [TransferrableObjectType.CanvasRenderingContext2D, canvasElement._index_],
    methodName,
    stringContext,
    4,
    serializedArgs,
  );
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('Setter on prototype', (t) => {
  const { stringContext, objectMutationProcessor, sandbox, canvasElement } = t.context;

  const methodName = 'lineWidth';
  const setter = sandbox.spy();
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const prototype = Object.getPrototypeOf(targetObject);

  // must declare property before sinon lets us stub setter
  (prototype[methodName] as any) = 'existent';
  sandbox.stub(prototype, methodName).set(setter);

  const serializedArg = [TransferrableObjectType.SmallInt, 5];

  executeCall(
    objectMutationProcessor,
    canvasElement,
    [TransferrableObjectType.CanvasRenderingContext2D, canvasElement._index_],
    methodName,
    stringContext,
    1,
    serializedArg,
  );
  t.true(setter.withArgs(5).calledOnce);
});

test('Mutation starts at a non-zero offset', (t) => {
  const { stringContext, objectMutationProcessor, sandbox, canvasElement } = t.context;

  const methodName = 'fillRect';
  const targetObject = canvasElement.getContext('2d');

  if (!targetObject) {
    throw new Error('targetObject is not defined.');
  }

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  const args = [1, 2, 3, 4];
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
    TransferrableMutationType.OBJECT_MUTATION,
    stringContext.store(methodName),
    4, // arg count
    TransferrableObjectType.CanvasRenderingContext2D,
    canvasElement._index_,
    ...serializedArgs,
  ];

  // add three values to the start of the mutation and change the offset
  const mutationsArray = new Uint16Array([1, 2, 3].concat(mutation));
  objectMutationProcessor.execute(mutationsArray, 3, /* allow */ true);

  t.true(stub.withArgs(...args).calledOnce);
});

test('Returns correct end offset', (t) => {
  const { stringContext, objectMutationProcessor, canvasElement, sandbox } = t.context;

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
    TransferrableMutationType.OBJECT_MUTATION,
    stringContext.store(methodName),
    4, // arg count
    TransferrableObjectType.CanvasRenderingContext2D,
    canvasElement._index_,
    ...serializedArgs,

    // add an extra value after the OBJECT_MUTATION, which should be at end offset after processing
    32,
  ];

  const mutationsArray = new Uint16Array([1, 2, 3].concat(mutation));
  const endOffset = objectMutationProcessor.execute(mutationsArray, 3, /* allow */ true);

  t.is(mutationsArray[endOffset], 32);
});

function executeCall(
  mutationProcessor: CommandExecutor,
  target: RenderableElement,
  serializedTargetObject: number[],
  fnName: string,
  stringContext: StringContext,
  argCount: number,
  serializedArgs: number[],
) {
  return mutationProcessor.execute(
    new Uint16Array([TransferrableMutationType.OBJECT_MUTATION, stringContext.store(fnName), argCount, ...serializedTargetObject, ...serializedArgs]),
    0,
    /* allow */ true,
  );
}
