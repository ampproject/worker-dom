import anyTest, {TestInterface} from 'ava';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {StringContext} from '../../main-thread/strings';
import {ObjectContext} from '../../main-thread/object-context';
import {CommandExecutor} from '../../main-thread/commands/interface';
import {Env} from './helpers/env';
import {NodeContext} from '../../main-thread/nodes';
import {WorkerContext} from '../../main-thread/worker';
import {normalizeConfiguration} from '../../main-thread/configuration';
import {TransferrableMutationType, TransferrableObjectType} from '../../transfer/TransferrableMutation';
import {CallFunctionProcessor} from "../../main-thread/commands/call-function";
import {TransferrableKeys} from "../../transfer/TransferrableKeys";
import {MessageType} from "../../transfer/Messages";

const test = anyTest as TestInterface<{
  sandbox: sinon.SinonSandbox;
  stringContext: StringContext;
  objectContext: ObjectContext;
  nodeContext: NodeContext;
  callFunctionProcessor: CommandExecutor;
  workerContextStub: SinonStub
}>;

test.beforeEach((t) => {
  const sandbox = sinon.createSandbox();
  const env = new Env();
  const {document} = env;
  const baseElement = document.createElement('div');

  const stringContext = new StringContext();
  const objectContext = new ObjectContext();
  const nodeContext = new NodeContext(stringContext, baseElement);

  const workerContext = {
    getWorker() {
    },
    messageToWorker() {
    },
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
    workerContextStub
  };
});

test.afterEach((t) => {
  const {sandbox} = t.context;
  sandbox.restore();
});

test('Void Method call with no arguments', (t) => {
  const {sandbox, stringContext, callFunctionProcessor, objectContext, workerContextStub} = t.context;

  const methodName = 'stroke';
  const targetObject = {
    [methodName]: () => {
      console.log("stroke called");
    }
  };

  const id = 1;
  objectContext.store(id, targetObject as any);

  const rid = 100;

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(
    callFunctionProcessor,
    [TransferrableObjectType.TransferObject, id],
    methodName,
    stringContext,
    rid,
    0,
    []
  );

  t.true(workerContextStub.withArgs(...[{
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: rid,
    [TransferrableKeys.success]: true,
    [TransferrableKeys.value]: undefined,
  }]).calledOnce)

  t.true(stub.withArgs().calledOnce);
});

test('Void Method with arguments', (t) => {
  const {sandbox, stringContext, callFunctionProcessor, objectContext, workerContextStub} = t.context;

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
  const methodName = 'stroke';
  const targetObject = {
    [methodName]: (a: number, b: number, c: number, d: number) => {
      console.log("stroke called with args: ", a, b, c, d);
    }
  };

  const id = 2;
  const rid = 200;

  objectContext.store(id, targetObject as any);

  const stub = ((targetObject[methodName] as sinon.SinonStub) = sandbox.stub());
  executeCall(
    callFunctionProcessor,
    [TransferrableObjectType.TransferObject, id],
    methodName,
    stringContext,
    rid,
    4,
    serializedArgs
  );

  t.true(workerContextStub.withArgs(...[{
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: rid,
    [TransferrableKeys.success]: true,
    [TransferrableKeys.value]: undefined,
  }]).calledOnce)

  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});


test('Method call with no arguments', (t) => {
  const {stringContext, callFunctionProcessor, objectContext, workerContextStub} = t.context;

  const methodName = 'stroke';
  const targetObject = {
    [methodName]: () => {
      console.log("stroke called");
      return {success: true};
    }
  };

  const id = 1;
  objectContext.store(id, targetObject as any);

  const rid = 100;

  executeCall(
    callFunctionProcessor,
    [TransferrableObjectType.TransferObject, id],
    methodName,
    stringContext,
    rid,
    0,
    []
  );

  t.true(workerContextStub.withArgs(...[{
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: rid,
    [TransferrableKeys.success]: true,
    [TransferrableKeys.value]: {success: true},
  }]).calledOnce)
});

test('Method with arguments', (t) => {
  const {stringContext, callFunctionProcessor, objectContext, workerContextStub} = t.context;

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
  const methodName = 'stroke';
  const targetObject = {
    [methodName]: (a: number, b: number, c: number, d: number) => {
      console.log("stroke called with args: ", a, b, c, d);
      return a + b + c + d;
    }
  };

  const id = 2;
  const rid = 200;

  objectContext.store(id, targetObject as any);

  executeCall(
    callFunctionProcessor,
    [TransferrableObjectType.TransferObject, id],
    methodName,
    stringContext,
    rid,
    4,
    serializedArgs
  );

  t.true(workerContextStub.withArgs(...[{
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: rid,
    [TransferrableKeys.success]: true,
    [TransferrableKeys.value]: 10,
  }]).calledOnce)
});

test('Global Method call', (t) => {
  const {stringContext, callFunctionProcessor, workerContextStub} = t.context;

  const methodName: string = 'stroke';
  // @ts-ignore
  window[methodName] = () => {
    console.log("window stroke called");
    return "done";
  };

  const rid = 400;

  executeCall(
    callFunctionProcessor,
    [TransferrableObjectType.Window, 0],
    methodName,
    stringContext,
    rid,
    0,
    []
  );

  t.true(workerContextStub.withArgs(...[{
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: rid,
    [TransferrableKeys.success]: true,
    [TransferrableKeys.value]: "done",
  }]).calledOnce)
});


test('Node Method call', (t) => {
  const {sandbox, stringContext, callFunctionProcessor, nodeContext, workerContextStub} = t.context;
  const methodName: string = 'stroke';
  const id = 555;

  const canvasElement = {
    _index_: id,
    [methodName]: () => {
      console.log("canvasElement stroke called");
      return "stroke from canvasElement";
    },
  } as unknown as HTMLCanvasElement;

  sandbox.stub(nodeContext, 'getNode').returns(canvasElement);

  const rid = 500;

  executeCall(
    callFunctionProcessor,
    [TransferrableObjectType.HTMLElement, id],
    methodName,
    stringContext,
    rid,
    0,
    []
  );

  t.true(workerContextStub.withArgs(...[{
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: rid,
    [TransferrableKeys.success]: true,
    [TransferrableKeys.value]: "stroke from canvasElement",
  }]).calledOnce)
});


test('Target not found', (t) => {
  const {stringContext, callFunctionProcessor, workerContextStub} = t.context;
  const methodName: string = 'not-exist';
  const id = -1;
  const rid = 2;

  executeCall(
    callFunctionProcessor,
    [TransferrableObjectType.HTMLElement, id],
    methodName,
    stringContext,
    rid,
    0,
    []
  );

  t.true(workerContextStub.withArgs(...[{
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: rid,
    [TransferrableKeys.success]: false,
    [TransferrableKeys.value]: new Error("Target object not found.").message,
  }]).calledOnce)
});


test('Method call exception', (t) => {
  const {sandbox, stringContext, callFunctionProcessor, nodeContext, workerContextStub} = t.context;
  const methodName: string = 'stroke';
  const id = 23;

  const canvasElement = {
    _index_: id,
    [methodName]: () => {
      console.log("canvasElement stroke called with exception");
      throw new Error("canvasElement stroke called exception");
    },
  } as unknown as HTMLCanvasElement;

  sandbox.stub(nodeContext, 'getNode').returns(canvasElement);

  const rid = 500;

  executeCall(
    callFunctionProcessor,
    [TransferrableObjectType.HTMLElement, id],
    methodName,
    stringContext,
    rid,
    0,
    []
  );

  t.true(workerContextStub.withArgs(...[{
    [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
    [TransferrableKeys.index]: rid,
    [TransferrableKeys.success]: false,
    [TransferrableKeys.value]: new Error("canvasElement stroke called exception").message,
  }]).calledOnce)
});

function executeCall(
  callFunctionProcessor: CommandExecutor,
  serializedTargetObject: number[],
  fnName: string,
  stringContext: StringContext,
  rid: number,
  argCount: number,
  serializedArgs: number[],
) {
  return callFunctionProcessor.execute(
    new Uint16Array([TransferrableMutationType.CALL_FUNCTION, ...serializedTargetObject, stringContext.store(fnName), rid, argCount, ...serializedArgs]),
    0,
    /* allow */ true,
  );
}
