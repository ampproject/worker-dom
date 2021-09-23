import anyTest, { TestInterface } from 'ava';
import { Env } from './helpers/env';
import { LongTaskCommandExecutor, LongTaskExecutor } from '../../main-thread/commands/long-task';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { StringContext } from '../../main-thread/strings';
import { NodeContext } from '../../main-thread/nodes';
import { WorkerContext } from '../../main-thread/worker';
import { normalizeConfiguration, WorkerDOMConfiguration } from '../../main-thread/configuration';
import { ObjectContext } from '../../main-thread/object-context';

async function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

const test = anyTest as TestInterface<{
  env: Env;
  executor: LongTaskCommandExecutor;
  longTasks: Array<Promise<any>>;
  stringContext: StringContext;
  nodeContext: NodeContext;
  workerContext: WorkerContext;
  objectContext: ObjectContext;
  baseElement: HTMLElement;
  config: WorkerDOMConfiguration;
}>;

test.beforeEach((t) => {
  const env = new Env();
  const { document } = env;
  const longTasks: Array<Promise<any>> = [];
  const baseElement = document.createElement('div');
  const stringContext = new StringContext();
  const nodeContext = new NodeContext(stringContext, baseElement);
  const objectContext = new ObjectContext();
  const workerContext = {
    getWorker() {},
    messageToWorker() {},
  } as unknown as WorkerContext;
  const config: WorkerDOMConfiguration = normalizeConfiguration({
    authorURL: 'authorURL',
    domURL: 'domURL',
    longTask: (promise: Promise<any>) => {
      longTasks.push(promise);
    },
  });
  const executor = LongTaskExecutor(stringContext, nodeContext, workerContext, objectContext, config);

  baseElement._index_ = 1;
  document.body.appendChild(baseElement);

  t.context = {
    env,
    executor,
    longTasks,
    baseElement,
    stringContext,
    nodeContext,
    objectContext,
    workerContext,
    config,
  };
});

test.afterEach((t) => {
  const { env } = t.context;
  env.dispose();
});

test.serial('should tolerate no callback', async (t) => {
  const { longTasks, baseElement, stringContext, nodeContext, workerContext, objectContext } = t.context;
  const executor = LongTaskExecutor(
    stringContext,
    nodeContext,
    workerContext,
    objectContext,
    normalizeConfiguration({
      authorURL: 'authorURL',
      domURL: 'domURL',
    }),
  );

  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, /* allow */ true);
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, /* allow */ true);

  await sleep(0);
  t.is(longTasks.length, 0);
});

test.serial('should create and release a long task', async (t) => {
  const { executor, longTasks, baseElement } = t.context;

  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // Ensure the promise is resolved in the end.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 1);
  t.false(executor.active);

  return longTasks[0];
});

test.serial('should nest long tasks', async (t) => {
  const { executor, longTasks, baseElement } = t.context;

  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // Nested: no new promise/task created.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // Unnest: the task is still active.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // Ensure the promise is resolved in the end.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 1);
  t.false(executor.active);
  return longTasks[0];
});

test.serial('multiple long tasks should have their handlers fired in sequence START,END,START', async (t) => {
  const { executor, baseElement, config } = t.context;
  let handlerCallSequence: Array<'start' | 'end'> = [];
  config.longTask = (p) => {
    handlerCallSequence.push('start');
    p.then(() => handlerCallSequence.push('end'));
  };

  // Start 1st task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);

  // End 1st task and start the second without a sleep in between.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, /* allow */ true);
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);

  t.deepEqual(handlerCallSequence, ['start', 'end', 'start']);
});

test.serial('should restart a next long tasks', async (t) => {
  const { executor, longTasks, baseElement } = t.context;

  // Start 1st task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 1);
  t.true(executor.active);

  // End 1st task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 1);
  t.false(executor.active);

  // Start 2nd task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_START, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 2);
  t.true(executor.active);

  // End 2nd task.
  executor.execute(new Uint16Array([TransferrableMutationType.LONG_TASK_END, baseElement._index_]), 0, /* allow */ true);
  await sleep(0);
  t.is(longTasks.length, 2);
  t.false(executor.active);

  // All tasks must resolve.
  return Promise.all(longTasks) as Promise<any>;
});
