import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';
import { StringContext } from '../../main-thread/strings';
import { ObjectContext } from '../../main-thread/object-context';
import { CommandExecutor } from '../../main-thread/commands/interface';
import { Env } from './helpers/env';
import { NodeContext } from '../../main-thread/nodes';
import { WorkerContext } from '../../main-thread/worker';
import { PropertyProcessor } from '../../main-thread/commands/property';
import { normalizeConfiguration } from '../../main-thread/configuration';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

const test = anyTest as TestInterface<{
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
  const { propertyProcessor, inputElement } = t.context;
  const newValue = 'new value';

  propertyProcessor.execute([TransferrableMutationType.PROPERTIES, inputElement, 'value', newValue], /* allow */ true);
  t.is(inputElement.value, newValue);
});

test('setting property back to an empty string', (t) => {
  const { propertyProcessor, inputElement } = t.context;
  const firstUpdateValue = 'new value';
  const secondUpdateValue = '';

  propertyProcessor.execute([TransferrableMutationType.PROPERTIES, inputElement, 'value', firstUpdateValue], /* allow */ true);
  t.is(inputElement.value, firstUpdateValue);

  propertyProcessor.execute([TransferrableMutationType.PROPERTIES, inputElement, 'value', secondUpdateValue], /* allow */ true);
  t.is(inputElement.value, secondUpdateValue);
});
