import anyTest, { TestInterface } from 'ava';
import { Env } from './helpers/env';
import { install } from '../../main-thread/install';
import { ExportedWorker } from '../../main-thread/exported-worker';

const test = anyTest as TestInterface<{
  env: Env;
  baseElement: HTMLElement;
}>;

test.beforeEach((t) => {
  const env = new Env();
  const { document } = env;
  const baseElement = document.createElement('div');
  document.body.appendChild(baseElement);

  t.context = {
    env,
    baseElement,
  };
});

test.afterEach((t) => {
  t.context.env.dispose();
});

test.serial('terminate the worker-dom', (t) => {
  const { env, baseElement } = t.context;

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  return install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
  }).then((workerDOM: ExportedWorker) => {
    t.is(env.workers.length, 1);
    const worker = env.workers[0];
    t.is(worker.terminated, false);
    workerDOM.terminate();
    t.is(worker.terminated, true);
  });
});

test.serial('attach shadow dom', async (t) => {
  const { baseElement } = t.context;
  baseElement.setAttribute('data-shadow-dom', 'open');

  const fetchPromise = Promise.all([Promise.resolve('workerDOMScript'), Promise.resolve('authorScript')]);
  await install(fetchPromise, baseElement, {
    authorURL: 'authorURL',
    domURL: 'domURL',
  });

  t.not(baseElement.shadowRoot, null);
});
