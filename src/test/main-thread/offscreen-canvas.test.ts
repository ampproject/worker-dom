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
import { OffscreenPolyfillCallProcessor } from '../../main-thread/commands/offscreen-polyfill-calls';
import { Strings } from '../../main-thread/strings';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { NumericBoolean } from '../../utils';
import { CommandExecutor } from '../../main-thread/commands/interface';

let sandbox: sinon.SinonSandbox;

const test = anyTest as TestInterface<{
  canvasElement: HTMLCanvasElement;
  context2d: CanvasRenderingContext2D;
  strings: Strings;
  offscreenCanvasProcessor: CommandExecutor;
}>;

test.beforeEach(t => {
  sandbox = sinon.createSandbox();

  const ctx = {};
  const canvasElement = ({ _index_: 1, getContext: (c: string) => ctx } as unknown) as HTMLCanvasElement;
  const context2d = canvasElement.getContext('2d');

  if (!context2d) {
    throw new Error('CanvasRenderingContext2D not defined.');
  }

  const strings = new Strings();
  const offscreenCanvasProcessor = OffscreenPolyfillCallProcessor(strings);

  t.context = {
    canvasElement,
    context2d,
    strings,
    offscreenCanvasProcessor,
  };
});

test.afterEach(t => {
  sandbox.restore();
});

test('method with no arguments', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'stroke';
  const stub = createStub(context2d, methodName);

  executeCall(offscreenCanvasProcessor, canvasElement, methodName, false, 0, [], false, strings);
  t.true(stub.withArgs().calledOnce);
});

test('method with int arguments', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'fillRect';
  const stub = createStub(context2d, methodName);
  const args = [1, 2, 3, 4];

  executeCall(offscreenCanvasProcessor, canvasElement, methodName, false, 0, args, false, strings);
  t.true(stub.withArgs(...args).calledOnce);
});

test('method with float arguments', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'fillRect';
  const stub = createStub(context2d, methodName);
  const args = [1.2, 2.3, 3.4, 4.8];

  executeCall(offscreenCanvasProcessor, canvasElement, methodName, false, 0, args, true, strings);
  t.true(stub.calledOnce);
  t.true(stub.calledWithMatch(...args.map(approx)));
});

test('method with string argument', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;
  const methodName = 'strokeText';

  const textArg = 'textArg';
  const textArgIndex = storeString(strings, textArg);
  console.log('textArgIndex: ' + textArgIndex);

  const actualArgs = [textArg, 1, 2];
  const passedArgs = [textArgIndex, 1, 2];
  const stub = createStub(context2d, methodName);

  executeCall(offscreenCanvasProcessor, canvasElement, methodName, false, 1, passedArgs, false, strings, textArgIndex);
  t.true(stub.withArgs(...actualArgs).calledOnce);
});

test('setter with int argument', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'lineWidth';
  const spy = sandbox.spy();
  createSetterStub(context2d, methodName, spy);

  const arg = 5;
  executeCall(offscreenCanvasProcessor, canvasElement, methodName, true, 0, [arg], false, strings);
  t.true(spy.withArgs(arg).calledOnce);
});

test('setter with float argument', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'lineWidth';
  const spy = sandbox.spy();
  createSetterStub(context2d, methodName, spy);

  const arg = 1.6;
  executeCall(offscreenCanvasProcessor, canvasElement, methodName, true, 0, [arg], true, strings);
  t.true(spy.calledOnce);
  t.true(spy.calledWithMatch(approx(arg)));
});

test('setter with string argument', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'fillStyle';
  const spy = sandbox.spy();
  createSetterStub(context2d, methodName, spy);

  const arg = 'textArg';
  const textArgIndex = storeString(strings, arg);

  executeCall(offscreenCanvasProcessor, canvasElement, methodName, true, 1, [arg], false, strings, textArgIndex);
  t.true(spy.withArgs(arg).calledOnce);
});

test('setLineDash case', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'setLineDash';
  const stub = createStub(context2d, methodName);
  const lineDash = [10, 20];

  executeCall(offscreenCanvasProcessor, canvasElement, methodName, false, 0, lineDash, true, strings);
  t.true(stub.withArgs(lineDash).calledOnce);
});

test('mutation starts at non-zero offset', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'fillRect';
  const stub = createStub(context2d, methodName);
  const args = [1, 2, 3, 4];

  const mutation = [
    TransferrableMutationType.OFFSCREEN_POLYFILL,
    canvasElement._index_,
    NumericBoolean.FALSE,
    args.length,
    storeString(strings, methodName),
    NumericBoolean.FALSE,
    0,
    ...args,
  ];

  const mutationsArray = new Uint16Array([1, 2, 3].concat(mutation));
  offscreenCanvasProcessor.execute(mutationsArray, 3, canvasElement);

  t.true(stub.withArgs(...args).calledOnce);
});

test('mutation returns correct end offset for int arguments', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'strokeRect';
  createStub(context2d, methodName);
  const args = [100, 200, 300, 400];

  const endOffset = executeCall(offscreenCanvasProcessor, canvasElement, methodName, false, 0, args, false, strings);

  // end offset should be 7 + number of arguments
  t.is(endOffset, 11);
});

test('mutation returns correct end offset with float arguments', t => {
  const { strings, context2d, offscreenCanvasProcessor, canvasElement } = t.context;

  const methodName = 'rect';
  createStub(context2d, methodName);
  const args = [1.11, 2.22, 3.33, 4.44];

  const endOffset = executeCall(offscreenCanvasProcessor, canvasElement, methodName, false, 0, args, true, strings);

  // end offset should be 7 + (number of arguments * 2)
  t.is(endOffset, 15);
});

// main-thread's strings API does not return an ID when storing a string
// so for convenience:
function storeString(strings: Strings, text: string, currentIndex = -1) {
  strings.store(text);
  return ++currentIndex;
}

function executeCall(
  offscreenCanvasProcessor: CommandExecutor,
  canvasElement: HTMLCanvasElement,
  fnName: string,
  isSetter: boolean,
  stringArgIndex: number,
  args: any[],
  float32Needed: boolean,
  strings: Strings,
  stringsIndex?: number,
): number {
  return offscreenCanvasProcessor.execute(
    new Uint16Array([
      TransferrableMutationType.OFFSCREEN_POLYFILL,
      canvasElement._index_,
      float32Needed ? NumericBoolean.TRUE : NumericBoolean.FALSE,
      args.length,
      storeString(strings, fnName, stringsIndex),
      isSetter ? NumericBoolean.TRUE : NumericBoolean.FALSE,
      stringArgIndex,
      ...(float32Needed ? new Uint16Array(new Float32Array(args).buffer) : args),
    ]),
    0,
    canvasElement,
  );
}

function createStub(obj: any, method: string) {
  obj[method] = sandbox.stub();
  return obj[method];
}

function createSetterStub(obj: any, property: string, spy: () => {}) {
  obj[property] = 'existent';
  sandbox.stub(obj, property).set(spy);
}

function approx(expected: number): sinon.SinonMatcher {
  return sinon.match(function(actual: number) {
    const diff = Math.abs(expected - actual);
    return diff < 0.001;
  }, `Expected roughly ${expected}`);
}
