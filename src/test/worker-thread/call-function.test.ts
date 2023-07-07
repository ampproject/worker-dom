import anyTest, {TestInterface} from 'ava';
import {callFunction, resetForTesting} from '../../worker-thread/function';
import {createTestingDocument} from '../DocumentCreation';
import {MessageType, MutationFromWorker} from '../../transfer/Messages';
import {TransferrableKeys} from '../../transfer/TransferrableKeys';
import {Document} from '../../worker-thread/dom/Document';
import {TransferrableMutationType} from '../../transfer/TransferrableMutation';
import {store} from '../../worker-thread/strings';
import * as phase from '../../worker-thread/phase';
import {Phase} from '../../transfer/Phase';
import {TransferrableObject} from "../../worker-thread/worker-thread";
import {serializeTransferrableObject} from "../../worker-thread/serializeTransferrableObject";

let index = 0;

const test = anyTest as TestInterface<{
  document: Document;
  mutationPromise: Promise<number[]>;
}>;

test.beforeEach((t) => {
  phase.set(Phase.Initializing);
  resetForTesting();
  const document = createTestingDocument();
  document[TransferrableKeys.observe]();
  document.listeners = {};

  document.removeGlobalEventListener = (type: string, listener: Function) => {
  }
  document.addGlobalEventListener = (type: string, listener: Function) => {
    document.listeners[type] = listener;
  }

  const mutationPromise: any = new Promise((resolve) => {
    document.postMessage = (message: MutationFromWorker) => {
      const mutation = Array.from(new Uint16Array(message[TransferrableKeys.mutations]));
      resolve(mutation);
    };
  });

  t.context = {document, mutationPromise};
});

function getCallFunctionResultEvent(index: number, success: boolean, value: any): MessageEvent {
  return {
    data: {
      [TransferrableKeys.type]: MessageType.CALL_FUNCTION_RESULT,
      [TransferrableKeys.index]: index,
      [TransferrableKeys.value]: value,
      [TransferrableKeys.success]: success,
    },
  } as any;
}

function getFunctionMutation(target: TransferrableObject, functionNameIdx: number, rid: number, args: number[]): Array<any> {
  return [
    TransferrableMutationType.CALL_FUNCTION,
    ...target[TransferrableKeys.serializeAsTransferrableObject](),
    functionNameIdx,
    rid,
    args.length,
    ...serializeTransferrableObject(args),
  ]
}

test.serial('Call void function w/o arguments', async (t) => {
  const {document, mutationPromise} = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2]
  } as TransferrableObject;
  const functionName = "test";
  const functionNameIdx = store(functionName);
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [], false, 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionNameIdx, rid, []));

  t.true(!!document.listeners["message"])
  document.listeners["message"](getCallFunctionResultEvent(rid, true, undefined));

  t.deepEqual(await result, undefined)
});


test.serial('Call void function w/ arguments', async (t) => {
  const {document, mutationPromise} = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2]
  } as TransferrableObject;
  const functionName = "test";
  const functionNameIdx = store(functionName);
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], false, 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionNameIdx, rid, [1, 2, 3, 4]));

  t.true(!!document.listeners["message"])
  document.listeners["message"](getCallFunctionResultEvent(rid, true, undefined));

  t.deepEqual(await result, undefined)
});


test.serial('Call function w/o arguments', async (t) => {
  const {document, mutationPromise} = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2]
  } as TransferrableObject;
  const functionName = "test";
  const functionNameIdx = store(functionName);
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [], false, 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionNameIdx, rid, []));

  t.true(!!document.listeners["message"])
  document.listeners["message"](getCallFunctionResultEvent(rid, true, {done: true}));

  t.deepEqual(await result, {done: true})
});

test.serial('Call function w/ arguments', async (t) => {
  const {document, mutationPromise} = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2]
  } as TransferrableObject;
  const functionName = "test";
  const functionNameIdx = store(functionName);
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], false, 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionNameIdx, rid, [1, 2, 3, 4]));

  t.true(!!document.listeners["message"])
  document.listeners["message"](getCallFunctionResultEvent(rid, true, "done"));

  t.deepEqual(await result, "done")
});

test.serial('Call function w/ timeout', async (t) => {
  const {document, mutationPromise} = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2]
  } as TransferrableObject;
  const functionName = "test";
  const functionNameIdx = store(functionName);
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], false, 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionNameIdx, rid, [1, 2, 3, 4]));

  await t.throwsAsync( () => result );
});

test.serial('Call function w/ error', async (t) => {
  const {document, mutationPromise} = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2]
  } as TransferrableObject;
  const functionName = "test";
  const functionNameIdx = store(functionName);
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], false, 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionNameIdx, rid, [1, 2, 3, 4]));


  t.true(!!document.listeners["message"])
  document.listeners["message"](getCallFunctionResultEvent(rid, false, "Error"));

  await t.throwsAsync( () => result );
});