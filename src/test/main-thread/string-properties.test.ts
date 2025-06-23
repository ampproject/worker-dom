import anyTest, { TestFn } from 'ava';
import * as sinon from 'sinon';
import { StringContext } from '../../main-thread/strings.js';
import { ObjectContext } from '../../main-thread/object-context.js';
import { CommandExecutor } from '../../main-thread/commands/interface.js';
import { Env } from './helpers/env.js';
import { NodeContext } from '../../main-thread/nodes.js';
import { WorkerContext } from '../../main-thread/worker.js';
import { PropertyProcessor } from '../../main-thread/commands/property.js';
import { normalizeConfiguration } from '../../main-thread/configuration.js';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation.js';
import { NumericBoolean } from '../../utils.js';

const test = anyTest as TestFn<{
  stringContext: StringContext;
  propertyProcessor: CommandExecutor;
  sandbox: sinon.SinonSandbox;
  inputElement: HTMLInputElement;
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

  const propertyProcessor = PropertyProcessor(
    stringContext,
    nodeContext,
    workerContext,
    objectContext,
    normalizeConfiguration({
      domURL: 'domURL',
      authorURL: 'authorURL',
    }),
  );

  const value = '';
  const inputElement = {
    _index_: 1,
    _value: value,
    set value(newValue) {
      (this as any)._value = newValue;
    },
    get value() {
      return (this as any)._value;
    },
  } as unknown as HTMLInputElement;
  sandbox.stub(nodeContext, 'getNode').returns(inputElement);

  t.context = {
    stringContext,
    propertyProcessor,
    sandbox,
    inputElement,
  };
});

test('setting property to a new string', (t) => {
  const { stringContext, propertyProcessor, inputElement } = t.context;
  const newValue = 'new value';
  const storedValueKey = stringContext.store('value');
  const storedNewValue = stringContext.store(newValue);

  propertyProcessor.execute(
    new Uint16Array([TransferrableMutationType.PROPERTIES, inputElement._index_, storedValueKey, NumericBoolean.FALSE, storedNewValue]),
    0,
    /* allow */ true,
  );
  t.is(inputElement.value, newValue);
});

test('setting property back to an empty string', (t) => {
  const { stringContext, propertyProcessor, inputElement } = t.context;
  const firstUpdateValue = 'new value';
  const secondUpdateValue = '';
  const storedValueKey = stringContext.store('value');
  const storedFirstUpdateValue = stringContext.store(firstUpdateValue);
  const storedSecondUpdateValue = stringContext.store(secondUpdateValue);

  propertyProcessor.execute(
    new Uint16Array([TransferrableMutationType.PROPERTIES, inputElement._index_, storedValueKey, NumericBoolean.FALSE, storedFirstUpdateValue]),
    0,
    /* allow */ true,
  );
  t.is(inputElement.value, firstUpdateValue);

  propertyProcessor.execute(
    new Uint16Array([TransferrableMutationType.PROPERTIES, inputElement._index_, storedValueKey, NumericBoolean.FALSE, storedSecondUpdateValue]),
    0,
    /* allow */ true,
  );
  t.is(inputElement.value, secondUpdateValue);
});
