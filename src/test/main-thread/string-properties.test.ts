/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import { NumericBoolean } from '../../utils';

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
  const workerContext = ({
    getWorker() {},
    messageToWorker() {},
  } as unknown) as WorkerContext;

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
  const inputElement = ({
    _index_: 1,
    _value: value,
    set value(newValue) {
      (this as any)._value = newValue;
    },
    get value() {
      return (this as any)._value;
    },
  } as unknown) as HTMLInputElement;
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
  const storedValueKey = storeString(stringContext, 'value');
  const storedNewValue = storeString(stringContext, newValue, storedValueKey);

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
  const storedValueKey = storeString(stringContext, 'value');
  const storedFirstUpdateValue = storeString(stringContext, firstUpdateValue, storedValueKey);
  const storedSecondUpdateValue = storeString(stringContext, secondUpdateValue, storedFirstUpdateValue);

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

function storeString(stringContext: StringContext, text: string, currentIndex = -1) {
  stringContext.store(text);
  return ++currentIndex;
}
