import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StringContext } from '../../main-thread/strings';
import { ObjectContext } from '../../main-thread/object-context';
import { CommandExecutor } from '../../main-thread/commands/interface';
import { Env } from './helpers/env';
import { NodeContext } from '../../main-thread/nodes';
import { WorkerContext } from '../../main-thread/worker';
import { normalizeConfiguration } from '../../main-thread/configuration';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { CallFunctionProcessor } from '../../main-thread/commands/call-function';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';

const test = anyTest as TestInterface<{
  sandbox: sinon.SinonSandbox;
  stringContext: StringContext;
  objectContext: ObjectContext;
  nodeContext: NodeContext;
  callFunctionProcessor: CommandExecutor;
  workerContextStub: SinonStub;
}>;

test.beforeEach((t) => {
  const sandbox = sinon.createSandbox();
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');

  const stringContext = new StringContext();
  const objectContext = new ObjectContext();
  const nodeContext = new NodeContext(stringContext, baseElement);

  const workerContext = {
    getWorker() {},
    messageToWorker() {},
  } as unknown as WorkerContext;

  const workerContextStub = ((workerContext['messageToWorker'] as sinon.SinonStub) = sandbox.stub());

  const callFunctionProcessor = CallFunctionProcessor(
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
    nodeContext,
    callFunctionProcessor,
    workerContextStub,
  };
});

test.afterEach((t) => {
  const { sandbox } = t.context;
  sandbox.restore();
});

test('Void Method call with no arguments', (t) => {
  const { sandbox, stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const methodName = 'stroke';
  const targetObject = {
    [methodName]: () => {
      console.log('stroke called');
    },
  };

  const rid = 100;

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(callFunctionProcessor, targetObject, methodName, stringContext, rid, []);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: undefined,
        },
      ],
    ).calledOnce,
  );

  t.true(stub.withArgs().calledOnce);
});

test('Void Method with arguments', (t) => {
  const { sandbox, stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const args = [1, 2, 3, 4];
  const methodName = 'stroke';
  const targetObject = {
    [methodName]: (a: number, b: number, c: number, d: number) => {
      console.log('stroke called with args: ', a, b, c, d);
    },
  };

  const rid = 200;

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(callFunctionProcessor, targetObject, methodName, stringContext, rid, args);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: undefined,
        },
      ],
    ).calledOnce,
  );

  t.true(stub.withArgs(...args).calledOnce);
});

test('Method call with no arguments', (t) => {
  const { stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const methodName = 'stroke';
  const targetObject = {
    [methodName]: () => {
      console.log('stroke called');
      return { success: true };
    },
  };

  const rid = 100;

  executeCall(callFunctionProcessor, targetObject, methodName, stringContext, rid, []);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: { success: true },
        },
      ],
    ).calledOnce,
  );
});

test('Method with arguments', (t) => {
  const { stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const args = [1, 2, 3, 4];
  const methodName = 'stroke';
  const targetObject = {
    [methodName]: (a: number, b: number, c: number, d: number) => {
      console.log('stroke called with args: ', a, b, c, d);
      return a + b + c + d;
    },
  };

  const rid = 200;

  executeCall(callFunctionProcessor, targetObject, methodName, stringContext, rid, args);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: 10,
        },
      ],
    ).calledOnce,
  );
});

test('Method with arguments and store result', (t) => {
  const { objectContext, stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const args = [1, 2, 3, 4];
  const methodName = 'stroke';
  const objectId = 111;
  const targetObject = {
    [methodName]: (a: number, b: number, c: number, d: number) => {
      console.log('stroke called with args: ', a, b, c, d);
      return { run: a + b + c + d };
    },
  };

  const rid = 200;

  executeCall(callFunctionProcessor, targetObject, methodName, stringContext, rid, args, false, objectId);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: { run: 10 },
        },
      ],
    ).calledOnce,
  );

  t.deepEqual(objectContext.get(objectId) as any, { run: 10 });
});

test('Global Method call', (t) => {
  const { stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const methodName: string = 'stroke';
  // @ts-ignore
  window[methodName] = () => {
    console.log('window stroke called');
    return 'done';
  };

  const rid = 400;

  executeCall(callFunctionProcessor, window, methodName, stringContext, rid, []);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: 'done',
        },
      ],
    ).calledOnce,
  );
});

test('Node Method call', (t) => {
  const { stringContext, callFunctionProcessor, workerContextStub } = t.context;
  const methodName: string = 'stroke';
  const id = 555;

  const canvasElement = {
    _index_: id,
    [methodName]: () => {
      console.log('canvasElement stroke called');
      return 'stroke from canvasElement';
    },
  } as unknown as HTMLCanvasElement;

  const rid = 500;

  executeCall(callFunctionProcessor, canvasElement, methodName, stringContext, rid, []);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: 'stroke from canvasElement',
        },
      ],
    ).calledOnce,
  );
});

test('Target not found', (t) => {
  const { stringContext, callFunctionProcessor, workerContextStub } = t.context;
  const methodName: string = 'not-exist';
  const rid = 2;

  executeCall(callFunctionProcessor, null as any, methodName, stringContext, rid, []);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: false,
          [TransferrableKeys.value]: new Error('Target object not found.').message,
        },
      ],
    ).calledOnce,
  );
});

test('Method call exception', (t) => {
  const { sandbox, stringContext, callFunctionProcessor, nodeContext, workerContextStub } = t.context;
  const methodName: string = 'stroke';
  const id = 23;

  const canvasElement = {
    _index_: id,
    [methodName]: () => {
      console.log('canvasElement stroke called with exception');
      throw new Error('canvasElement stroke called exception');
    },
  } as unknown as HTMLCanvasElement;

  sandbox.stub(nodeContext, 'getNode').returns(canvasElement);

  const rid = 500;

  executeCall(callFunctionProcessor, canvasElement, methodName, stringContext, rid, []);

  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: false,
          [TransferrableKeys.value]: String(new Error('canvasElement stroke called exception')),
        },
      ],
    ).calledOnce,
  );
});

test('Method async with arguments', async (t) => {
  const { stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const args = [1, 2, 3, 4];
  const methodName = 'stroke';
  const targetObject = {
    [methodName]: async (a: number, b: number, c: number, d: number) => {
      console.log('stroke called with args: ', a, b, c, d);
      return a + b + c + d;
    },
  };

  const rid = 200;

  executeCall(callFunctionProcessor, targetObject, methodName, stringContext, rid, args, true);
  await sleep(0);
  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: 10,
        },
      ],
    ).calledOnce,
  );
});

test('Method async with arguments and error', async (t) => {
  const { stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const args = [1, 2, 3, 4];
  const methodName = 'stroke';
  const targetObject = {
    [methodName]: async (a: number, b: number, c: number, d: number) => {
      console.log('stroke called with args: ', a, b, c, d);
      throw new Error('error');
    },
  };

  const rid = 200;

  executeCall(callFunctionProcessor, targetObject, methodName, stringContext, rid, args, true);
  await sleep(0);
  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: false,
          [TransferrableKeys.value]: 'Error: error',
        },
      ],
    ).calledOnce,
  );
});

test('Method async with arguments and store object', async (t) => {
  const { objectContext, stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const args = [1, 2, 3, 4];
  const methodName = 'stroke';
  const objectId = 112;
  const targetObject = {
    [methodName]: async (a: number, b: number, c: number, d: number) => {
      console.log('stroke called with args: ', a, b, c, d);
      return { test: a + b + c + d };
    },
  };

  const rid = 200;

  executeCall(callFunctionProcessor, targetObject, methodName, stringContext, rid, args, true, objectId);
  await sleep(0);
  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: { test: 10 },
        },
      ],
    ).calledOnce,
  );

  t.deepEqual(objectContext.get(objectId) as any, { test: 10 });
});

test('Method with callback with arguments and store object', (t) => {
  const { objectContext, stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const methodName = 'stroke';
  const objectId = 122;
  const targetObject = {
    [methodName]: (a: number, b: number, success: (val: any) => void, error: (reason: string) => void): void => {
      console.log('stroke called with args: ', a, b);
      success({ test: a + b });
    },
  };

  const rid = 200;

  executeCall(
    callFunctionProcessor,
    targetObject,
    methodName,
    stringContext,
    rid,
    [1, 2, '__successCallback__', '__errorCallback__'],
    true,
    objectId,
  );
  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: true,
          [TransferrableKeys.value]: { test: 3 },
        },
      ],
    ).calledOnce,
  );

  t.deepEqual(objectContext.get(objectId) as any, { test: 3 });
});

test('Method with callback with arguments and store object and error', (t) => {
  const { objectContext, stringContext, callFunctionProcessor, workerContextStub } = t.context;

  const methodName = 'stroke';
  const objectId = 122;
  const targetObject = {
    [methodName]: (a: number, b: number, success: (val: any) => void, error: (reason: string) => void): void => {
      console.log('stroke called with args: ', a, b);
      error('error !!!');
    },
  };

  const rid = 200;

  executeCall(
    callFunctionProcessor,
    targetObject,
    methodName,
    stringContext,
    rid,
    [1, 2, '__successCallback__', '__errorCallback__'],
    true,
    objectId,
  );
  t.true(
    workerContextStub.withArgs(
      ...[
        {
          [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
          [TransferrableKeys.index]: rid,
          [TransferrableKeys.success]: false,
          [TransferrableKeys.value]: 'error !!!',
        },
      ],
    ).calledOnce,
  );

  t.throws(() => objectContext.get(objectId));
});

async function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

function executeCall(
  callFunctionProcessor: CommandExecutor,
  targetObject: {},
  fnName: string,
  stringContext: StringContext,
  rid: number,
  serializedArgs: any[],
  isFunctionAsync: boolean = false,
  storeResultObjectId: number = 0,
) {
  console.log('!!!!!!2 ', serializedArgs);
  return callFunctionProcessor.execute(
    [TransferrableMutationType.CALL_FUNCTION, targetObject, fnName, rid, isFunctionAsync, serializedArgs, storeResultObjectId],
    /* allow */ true,
  );
}
