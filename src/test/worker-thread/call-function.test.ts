import anyTest, { TestInterface } from 'ava';
import { callFunction, resetForTesting } from '../../worker-thread/function';
import { createTestingDocument } from '../DocumentCreation';
import { MessageType, MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { Document } from '../../worker-thread/dom/Document';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import * as phase from '../../worker-thread/phase';
import { Phase } from '../../transfer/Phase';
import { TransferrableObject } from '../../worker-thread/worker-thread';
import { serializeTransferableMessage } from '../../worker-thread/serializeTransferrableObject';

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

  document.removeGlobalEventListener = (type: string, listener: Function) => {};
  document.addGlobalEventListener = (type: string, listener: Function) => {
    document.listeners[type] = listener;
  };

  const mutationPromise: any = new Promise((resolve) => {
    document.postMessage = (message: MutationFromWorker) => {
      const mutation = message[TransferrableKeys.mutations];
      resolve(mutation);
    };
  });

  t.context = { document, mutationPromise };
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

function getFunctionMutation(
  target: TransferrableObject,
  functionName: string,
  rid: number,
  async: boolean,
  args: number[],
  objectId: number,
): Array<any> {
  return [serializeTransferableMessage([TransferrableMutationType.CALL_FUNCTION, target, functionName, rid, async, args, objectId]).buffer];
}

test.serial('Call sync void function w/o arguments', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [], 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, false, [], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, undefined));

  t.deepEqual(await result, undefined);
});

test.serial('Call sync void function w/ arguments', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, false, [1, 2, 3, 4], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, undefined));

  t.deepEqual(await result, undefined);
});

test.serial('Call sync function w/o arguments', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [], 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, false, [], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, { done: true }));

  t.deepEqual(await result, { done: true });
});

test.serial('Call sync function w/ arguments', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, false, [1, 2, 3, 4], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, 'done'));

  t.deepEqual(await result, 'done');
});

test.serial('Call sync function w/ arguments and store object', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const objectId = 123;
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000, false, objectId);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, false, [1, 2, 3, 4], objectId));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, 'done'));

  t.deepEqual(await result, 'done');
});

test.serial('Call sync function w/ timeout', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, false, [1, 2, 3, 4], 0));

  await t.throwsAsync(() => result);
});

test.serial('Call sync function w/ error', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, false, [1, 2, 3, 4], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, false, 'Error'));

  await t.throwsAsync(() => result);
});

// async
test.serial('Call async void function w/o arguments', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [], 1000, true);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, true, [], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, undefined));

  t.deepEqual(await result, undefined);
});

test.serial('Call async void function w/ arguments', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000, true);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, true, [1, 2, 3, 4], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, undefined));

  t.deepEqual(await result, undefined);
});

test.serial('Call async function w/o arguments', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [], 1000, true);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, true, [], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, { done: true }));

  t.deepEqual(await result, { done: true });
});

test.serial('Call async function w/ arguments', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000, true);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, true, [1, 2, 3, 4], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, 'done'));

  t.deepEqual(await result, 'done');
});

test.serial('Call async function w/ arguments with store object', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;
  const objectId = 124;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000, true, objectId);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, true, [1, 2, 3, 4], objectId));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, true, 'done'));

  t.deepEqual(await result, 'done');
});

test.serial('Call async function w/ timeout', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000, true);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, true, [1, 2, 3, 4], 0));

  await t.throwsAsync(() => result);
});

test.serial('Call async function w/ error', async (t) => {
  const { document, mutationPromise } = t.context;
  const obj = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => [1, 2],
  } as TransferrableObject;
  const functionName = 'test';
  const rid = ++index;

  const result = callFunction(document, obj as TransferrableObject, functionName, [1, 2, 3, 4], 1000, true);
  const mutation = await mutationPromise;

  t.deepEqual(mutation, getFunctionMutation(obj, functionName, rid, true, [1, 2, 3, 4], 0));

  t.true(!!document.listeners['message']);
  document.listeners['message'](getCallFunctionResultEvent(rid, false, 'Error'));

  await t.throwsAsync(() => result);
});