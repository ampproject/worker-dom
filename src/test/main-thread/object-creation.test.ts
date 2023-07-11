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
  const { objectContext, objectCreationProcessor, sandbox, canvasElement } = t.context;

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

  objectCreationProcessor.execute([TransferrableMutationType.OBJECT_CREATION, methodName, objectId, targetObject, [1, 2, 3, 4]], /* allow */ true);

  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
  t.is(objectContext.get(objectId), gradientObject);
});
