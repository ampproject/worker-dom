import anyTest, { TestInterface } from 'ava';
import { Env } from './helpers/env';
import { MutatorProcessor } from '../../main-thread/mutator';
import { NodeContext } from '../../main-thread/nodes';
import { StringContext } from '../../main-thread/strings';
import { WorkerContext } from '../../main-thread/worker';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { Phase } from '../../transfer/Phase';
import { normalizeConfiguration } from '../../main-thread/configuration';
import { ObjectContext } from '../../main-thread/object-context';
import { serializeTransferableMessage } from '../../worker-thread/serializeTransferrableObject';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';

const test = anyTest as TestInterface<{
  env: Env;
  baseElement: Element;
  stringContext: StringContext;
  nodeContext: NodeContext;
  workerContext: WorkerContext;
  objectContext: ObjectContext;
  baseElementTransferable: any;
}>;

test.beforeEach((t) => {
  const env = new Env();

  const { document } = env;
  const baseElement = document.createElement('div');
  document.body.appendChild(baseElement);

  const stringContext = new StringContext();
  const objectContext = new ObjectContext();
  const nodeContext = new NodeContext(stringContext, baseElement);

  const workerContext = {
    getWorker() {},
    messageToWorker() {},
  } as unknown as WorkerContext;

  const baseElementTransferable = {
    [TransferrableKeys.serializeAsTransferrableObject]: () => {
      return [TransferrableObjectType.HTMLElement, 2];
    },
  };
  t.context = {
    env,
    baseElement,
    stringContext,
    nodeContext,
    workerContext,
    objectContext,
    baseElementTransferable,
  };
});

test.afterEach((t) => {
  const { env } = t.context;
  env.dispose();
});

test.serial('batch mutations', (t) => {
  const { env, baseElement, stringContext, nodeContext, workerContext, objectContext, baseElementTransferable } = t.context;
  const { rafTasks } = env;
  const mutator = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
    }),
    objectContext,
  );

  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    ['hidden'],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'hidden',
        0,
        0 + 1,
      ]).buffer,
    ],
  );
  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    ['data-one'],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'data-one',
        0,
        1 + 1,
      ]).buffer,
    ],
  );

  t.is(baseElement.getAttribute('hidden'), null);
  t.is(baseElement.getAttribute('data-one'), null);
  t.is(rafTasks.length, 1);
  rafTasks[0]();
  t.is(baseElement.getAttribute('hidden'), 'hidden');
  t.is(baseElement.getAttribute('data-one'), 'data-one');

  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    ['data-two'],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'data-two',
        0,
        2 + 1,
      ]).buffer,
    ],
  );

  t.is(baseElement.getAttribute('data-two'), null);
  t.is(rafTasks.length, 2);
  rafTasks[1]();
  t.is(baseElement.getAttribute('data-two'), 'data-two');
});

test.serial('batch mutations with custom pump', (t) => {
  const { env, baseElement, stringContext, nodeContext, workerContext, objectContext, baseElementTransferable } = t.context;
  const { rafTasks } = env;

  const tasks: Array<{ phase: Phase; flush: Function }> = [];
  const mutator = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
      mutationPump: (flush: Function, phase: Phase) => {
        tasks.push({ phase, flush });
      },
    }),
    objectContext,
  );

  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    ['hidden'],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'hidden',
        0,
        0 + 1,
      ]).buffer,
    ],
  );
  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    ['data-one'],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'data-one',
        0,
        1 + 1,
      ]).buffer,
    ],
  );

  t.is(baseElement.getAttribute('hidden'), null);
  t.is(baseElement.getAttribute('data-one'), null);
  t.is(rafTasks.length, 0);
  t.is(tasks.length, 1);
  t.is(tasks[0].phase, Phase.Mutating);
  tasks[0].flush();
  t.is(baseElement.getAttribute('hidden'), 'hidden');
  t.is(baseElement.getAttribute('data-one'), 'data-one');

  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    ['data-two'],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'data-two',
        0,
        2 + 1,
      ]).buffer,
    ],
  );

  t.is(baseElement.getAttribute('data-two'), null);
  t.is(rafTasks.length, 0);
  t.is(tasks.length, 2);
  tasks[1].flush();
  t.is(baseElement.getAttribute('data-two'), 'data-two');
});

test.serial('leverage allowlist to exclude mutation type', (t) => {
  const { env, baseElement, stringContext, nodeContext, workerContext, objectContext, baseElementTransferable } = t.context;
  const { rafTasks } = env;
  const mutator = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
      executorsAllowed: [TransferrableMutationType.CHILD_LIST],
    }),
    objectContext,
  );

  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    ['hidden'],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'hidden',
        0,
        0 + 1,
      ]).buffer,
    ],
  );
  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    ['data-one'],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'data-one',
        0,
        1 + 1,
      ]).buffer,
    ],
  );

  t.is(baseElement.getAttribute('hidden'), null);
  t.is(baseElement.getAttribute('data-one'), null);
  t.is(rafTasks.length, 1);
  rafTasks[0]();
  t.is(baseElement.getAttribute('hidden'), null);
  t.is(baseElement.getAttribute('data-one'), null);
});

test.serial('split strings from mutations', (t) => {
  const { env, baseElement, stringContext, nodeContext, workerContext, objectContext, baseElementTransferable } = t.context;
  const { rafTasks } = env;
  const mutator = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
    }),
    objectContext,
  );

  mutator.mutate(MessageType.MUTATE, new ArrayBuffer(0), ['hidden'], []);
  mutator.mutate(
    MessageType.MUTATE,
    new ArrayBuffer(0),
    [],
    [
      serializeTransferableMessage([
        TransferrableMutationType.ATTRIBUTES,
        baseElementTransferable, // Base Node
        'hidden',
        0,
        0 + 1,
      ]).buffer,
    ],
  );

  t.is(baseElement.getAttribute('hidden'), null);
  t.is(rafTasks.length, 1);
  rafTasks[0]();
  t.is(baseElement.getAttribute('hidden'), 'hidden');
});
