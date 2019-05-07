/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS-IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';
import { CanvasRenderingContext2DShim, deferredUpgrades } from '../../worker-thread/canvas/CanvasRenderingContext2D';
import { HTMLCanvasElement } from '../../worker-thread/dom/HTMLCanvasElement';
import { CanvasRenderingContext2D } from '../../worker-thread/canvas/CanvasTypes';
import { createTestingDocument } from '../DocumentCreation';

const test = anyTest as TestInterface<{
  canvas: HTMLCanvasElement;
  context2d: CanvasRenderingContext2DShim<HTMLCanvasElement>;
  deferredUpgrade: { resolve: (instance: FakeOffscreenCanvas) => void; reject: (errorMsg: string) => void };
  implementation: CanvasRenderingContext2D;
  sandbox: sinon.SinonSandbox;
}>;

class FakeOffscreenCanvas {
  // For testing convenience; this class looks different from the OffscreenCanvas spec API
  public static mostRecentInstance: FakeOffscreenCanvas;
  public implementation: CanvasRenderingContext2D;

  constructor() {
    // this.x, y
    const context = ({} as unknown) as CanvasRenderingContext2D;
    FakeOffscreenCanvas.mostRecentInstance = this;
    this.implementation = context;
  }

  getContext(c: string): CanvasRenderingContext2D {
    return this.implementation;
  }
}
(global as any).OffscreenCanvas = FakeOffscreenCanvas;

test.beforeEach(t => {
  const sandbox = sinon.createSandbox();
  const document = createTestingDocument();
  const canvas = document.createElement('canvas') as HTMLCanvasElement;

  t.context = {
    canvas,
    context2d: canvas.getContext('2d'),
    deferredUpgrade: deferredUpgrades.get(canvas),
    implementation: FakeOffscreenCanvas.mostRecentInstance.getContext('2d'),
    sandbox,
  };
});

test.afterEach(t => {
  const { sandbox } = t.context;
  sandbox.restore();
  sandbox.verify();
});

// describe clearRect
test('context calls clearRect', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['clearRect'] = sandbox.stub());
  context2d.clearRect(1, 2, 3, 4);
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('context only calls upgraded clearRect if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['clearRect'] = sandbox.stub());
  const implStub = (implementation['clearRect'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.clearRect(1, 2, 3, 4);
    t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of clearRect when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['clearRect'] = sandbox.stub());
  const implStub = (implementation['clearRect'] = sandbox.stub());

  context2d.clearRect(10, 9, 8, 7);
  t.true(implStub.withArgs(10, 9, 8, 7).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(10, 9, 8, 7).calledOnce);
  });
});

// describe fillRect
test('context calls fillRect', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['fillRect'] = sandbox.stub());
  context2d.fillRect(1, 2, 3, 4);
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('context only calls upgraded fillRect if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['fillRect'] = sandbox.stub());
  const implStub = (implementation['fillRect'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.fillRect(1, 2, 3, 4);
    t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of fillRect when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['fillRect'] = sandbox.stub());
  const implStub = (implementation['fillRect'] = sandbox.stub());

  context2d.fillRect(10, 9, 8, 7);
  t.true(implStub.withArgs(10, 9, 8, 7).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(10, 9, 8, 7).calledOnce);
  });
});

// describe strokeRect
test('context calls strokeRect', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['strokeRect'] = sandbox.stub());
  context2d.strokeRect(1, 2, 3, 4);
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('context only calls upgraded strokeRect if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['strokeRect'] = sandbox.stub());
  const implStub = (implementation['strokeRect'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.strokeRect(1, 2, 3, 4);
    t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of strokeRect when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['strokeRect'] = sandbox.stub());
  const implStub = (implementation['strokeRect'] = sandbox.stub());

  context2d.strokeRect(10, 9, 8, 7);
  t.true(implStub.withArgs(10, 9, 8, 7).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(10, 9, 8, 7).calledOnce);
  });
});

// describe fillText
test('context calls fillText', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['fillText'] = sandbox.stub());
  context2d.fillText('hello, world', 1, 2);
  t.true(stub.withArgs('hello, world', 1, 2).calledOnce);
});

test('context only calls upgraded fillText if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['fillText'] = sandbox.stub());
  const implStub = (implementation['fillText'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.fillText('hello, world', 1, 2);
    t.true(stub.withArgs('hello, world', 1, 2).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of fillText when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['fillText'] = sandbox.stub());
  const implStub = (implementation['fillText'] = sandbox.stub());

  context2d.fillText('hello, world', 1, 2);
  t.true(implStub.withArgs('hello, world', 1, 2).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs('hello, world', 1, 2).calledOnce);
  });
});

// describe strokeText
test('context calls strokeText', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['strokeText'] = sandbox.stub());
  context2d.strokeText('hello, world', 1, 2);
  t.true(stub.withArgs('hello, world', 1, 2).calledOnce);
});

test('context only calls upgraded strokeText if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['strokeText'] = sandbox.stub());
  const implStub = (implementation['strokeText'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.strokeText('hello, world', 1, 2);
    t.true(stub.withArgs('hello, world', 1, 2).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of strokeText when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['strokeText'] = sandbox.stub());
  const implStub = (implementation['strokeText'] = sandbox.stub());

  context2d.strokeText('hello, world', 1, 2);
  t.true(implStub.withArgs('hello, world', 1, 2).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs('hello, world', 1, 2).calledOnce);
  });
});

// describe measureText
test('context calls measureText', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['measureText'] = sandbox.stub());
  context2d.measureText('hello, world');
  t.true(stub.withArgs('hello, world').calledOnce);
});

test('context only calls upgraded measureText if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['measureText'] = sandbox.stub());
  const implStub = (implementation['measureText'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.measureText('hello, world');
    t.true(stub.withArgs('hello, world').calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of measureText when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['measureText'] = sandbox.stub());
  const implStub = (implementation['measureText'] = sandbox.stub());

  context2d.measureText('hello, world');
  t.true(implStub.withArgs('hello, world').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs('hello, world').calledOnce);
  });
});

// describe lineWidth
test('context calls set lineWidth', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'lineWidth', spy);
  context2d.lineWidth = 100;
  t.true(spy.withArgs(100).calledOnce);
});

test('context calls get lineWidth', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'lineWidth', spy);
  context2d.lineWidth;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set lineWidth if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'lineWidth', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'lineWidth', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineWidth = 100;
    t.true(spy.withArgs(100).calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get lineWidth if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'lineWidth', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'lineWidth', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineWidth;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set lineWidth when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'lineWidth', instanceSpy);
  createSetterStub(sandbox, implementation, 'lineWidth', implSpy);

  context2d.lineWidth = 200;
  t.true(implSpy.withArgs(200).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs(200).calledOnce);
  });
});

// describe lineCap
test('context calls set lineCap', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'lineCap', spy);
  context2d.lineCap = 'butt';
  t.true(spy.withArgs('butt').calledOnce);
});

test('context calls get lineCap', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'lineCap', spy);
  context2d.lineCap;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set lineCap if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'lineCap', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'lineCap', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineCap = 'butt';
    t.true(spy.withArgs('butt').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get lineCap if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'lineCap', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'lineCap', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineCap;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set lineCap when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'lineCap', instanceSpy);
  createSetterStub(sandbox, implementation, 'lineCap', implSpy);

  context2d.lineCap = 'round';
  t.true(implSpy.withArgs('round').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('round').calledOnce);
  });
});

// describe lineJoin
test('context calls set lineJoin', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'lineJoin', spy);
  context2d.lineJoin = 'bevel';
  t.true(spy.withArgs('bevel').calledOnce);
});

test('context calls get lineJoin', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'lineJoin', spy);
  context2d.lineJoin;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set lineJoin if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'lineJoin', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'lineJoin', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineJoin = 'bevel';
    t.true(spy.withArgs('bevel').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get lineJoin if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'lineJoin', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'lineJoin', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineJoin;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set lineJoin when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'lineJoin', instanceSpy);
  createSetterStub(sandbox, implementation, 'lineJoin', implSpy);

  context2d.lineJoin = 'miter';
  t.true(implSpy.withArgs('miter').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('miter').calledOnce);
  });
});

// describe miterLimit
test('context calls set miterLimit', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'miterLimit', spy);
  context2d.miterLimit = 50;
  t.true(spy.withArgs(50).calledOnce);
});

test('context calls get miterLimit', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'miterLimit', spy);
  context2d.miterLimit;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set miterLimit if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'miterLimit', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'miterLimit', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.miterLimit = 100;
    t.true(spy.withArgs(100).calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get miterLimit if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'miterLimit', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'miterLimit', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.miterLimit;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set miterLimit when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'miterLimit', instanceSpy);
  createSetterStub(sandbox, implementation, 'miterLimit', implSpy);

  context2d.miterLimit = 200;
  t.true(implSpy.withArgs(200).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs(200).calledOnce);
  });
});

// describe getLineDash
test('context calls getLineDash', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['getLineDash'] = sandbox.stub());
  context2d.getLineDash();
  t.true(stub.calledOnce);
});

test('context only calls upgraded getLineDash if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['getLineDash'] = sandbox.stub());
  const implStub = (implementation['getLineDash'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.getLineDash();
    t.true(stub.calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of getLineDash when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['getLineDash'] = sandbox.stub());
  const implStub = (implementation['getLineDash'] = sandbox.stub());

  context2d.getLineDash();
  t.true(implStub.calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.calledOnce);
  });
});

// describe setLineDash
test('context calls setLineDash', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['setLineDash'] = sandbox.stub());
  context2d.setLineDash([1, 2, 3, 4]);
  t.true(stub.withArgs([1, 2, 3, 4]).calledOnce);
});

test('context only calls upgraded setLineDash if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['setLineDash'] = sandbox.stub());
  const implStub = (implementation['setLineDash'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.setLineDash([1, 2, 3, 4]);
    t.true(stub.withArgs([1, 2, 3, 4]).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of setLineDash when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['setLineDash'] = sandbox.stub());
  const implStub = (implementation['setLineDash'] = sandbox.stub());

  context2d.setLineDash([0, 1, 2]);
  t.true(implStub.withArgs([0, 1, 2]).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs([0, 1, 2]).calledOnce);
  });
});

// describe lineDashOffset
test('context calls set lineDashOffset', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'lineDashOffset', spy);
  context2d.lineDashOffset = 150;
  t.true(spy.withArgs(150).calledOnce);
});

test('context calls get lineDashOffset', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'lineDashOffset', spy);
  context2d.lineDashOffset;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set lineDashOffset if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'lineDashOffset', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'lineDashOffset', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineDashOffset = 200;
    t.true(spy.withArgs(200).calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get lineDashOffset if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'lineDashOffset', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'lineDashOffset', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineDashOffset;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set lineDashOffset when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'lineDashOffset', instanceSpy);
  createSetterStub(sandbox, implementation, 'lineDashOffset', implSpy);

  context2d.lineDashOffset = 50;
  t.true(implSpy.withArgs(50).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs(50).calledOnce);
  });
});

// describe font
test('context calls set font', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'font', spy);
  context2d.font = 'Times';
  t.true(spy.withArgs('Times').calledOnce);
});

test('context calls get font', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'font', spy);
  context2d.font;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set font if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'font', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'font', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.font = 'Arial';
    t.true(spy.withArgs('Arial').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get font if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'font', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'font', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.font;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set font when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'font', instanceSpy);
  createSetterStub(sandbox, implementation, 'font', implSpy);

  context2d.font = 'Courier';
  t.true(implSpy.withArgs('Courier').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('Courier').calledOnce);
  });
});

// describe textAlign
test('context calls set textAlign', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'textAlign', spy);
  context2d.textAlign = 'center';
  t.true(spy.withArgs('center').calledOnce);
});

test('context calls get textAlign', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'textAlign', spy);
  context2d.textAlign;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set textAlign if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'textAlign', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'textAlign', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.textAlign = 'left';
    t.true(spy.withArgs('left').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get textAlign if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'textAlign', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'textAlign', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.textAlign;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set textAlign when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'textAlign', instanceSpy);
  createSetterStub(sandbox, implementation, 'textAlign', implSpy);

  context2d.textAlign = 'end';
  t.true(implSpy.withArgs('end').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('end').calledOnce);
  });
});

// describe textBaseline
test('context calls set textBaseline', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'textBaseline', spy);
  context2d.textBaseline = 'alphabetic';
  t.true(spy.withArgs('alphabetic').calledOnce);
});

test('context calls get textBaseline', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'textBaseline', spy);
  context2d.textBaseline;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set textBaseline if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'textBaseline', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'textBaseline', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.textBaseline = 'middle';
    t.true(spy.withArgs('middle').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get textBaseline if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'textBaseline', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'textBaseline', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.textBaseline;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set textBaseline when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'textBaseline', instanceSpy);
  createSetterStub(sandbox, implementation, 'textBaseline', implSpy);

  context2d.textBaseline = 'hanging';
  t.true(implSpy.withArgs('hanging').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('hanging').calledOnce);
  });
});

// describe direction
test('context calls set direction', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'direction', spy);
  context2d.direction = 'rtl';
  t.true(spy.withArgs('rtl').calledOnce);
});

test('context calls get direction', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'direction', spy);
  context2d.direction;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set direction if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'direction', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'direction', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.direction = 'ltr';
    t.true(spy.withArgs('ltr').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get direction if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'direction', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'direction', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.direction;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set direction when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'direction', instanceSpy);
  createSetterStub(sandbox, implementation, 'direction', implSpy);

  context2d.direction = 'inherit';
  t.true(implSpy.withArgs('inherit').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('inherit').calledOnce);
  });
});

// describe fillStyle
test('context calls set fillStyle', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'fillStyle', spy);
  context2d.fillStyle = 'red';
  t.true(spy.withArgs('red').calledOnce);
});

test('context calls get fillStyle', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'fillStyle', spy);
  context2d.fillStyle;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set fillStyle if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'fillStyle', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'fillStyle', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.fillStyle = 'yellow';
    t.true(spy.withArgs('yellow').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get fillStyle if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'fillStyle', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'fillStyle', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.fillStyle;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set fillStyle when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'fillStyle', instanceSpy);
  createSetterStub(sandbox, implementation, 'fillStyle', implSpy);

  context2d.fillStyle = 'black';
  t.true(implSpy.withArgs('black').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('black').calledOnce);
  });
});

// describe strokeStyle
test('context calls set strokeStyle', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'strokeStyle', spy);
  context2d.strokeStyle = 'blue';
  t.true(spy.withArgs('blue').calledOnce);
});

test('context calls get strokeStyle', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'strokeStyle', spy);
  context2d.strokeStyle;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set strokeStyle if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'strokeStyle', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'strokeStyle', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.strokeStyle = 'green';
    t.true(spy.withArgs('green').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get strokeStyle if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'strokeStyle', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'strokeStyle', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.strokeStyle;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set strokeStyle when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'strokeStyle', instanceSpy);
  createSetterStub(sandbox, implementation, 'strokeStyle', implSpy);

  context2d.strokeStyle = 'black';
  t.true(implSpy.withArgs('black').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('black').calledOnce);
  });
});

// describe createLinearGradient
test('context calls createLinearGradient', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['createLinearGradient'] = sandbox.stub());
  context2d.createLinearGradient(1, 2, 3, 4);
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('context only calls upgraded createLinearGradient if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['createLinearGradient'] = sandbox.stub());
  const implStub = (implementation['createLinearGradient'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.createLinearGradient(1, 2, 3, 4);
    t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of createLinearGradient when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['createLinearGradient'] = sandbox.stub());
  const implStub = (implementation['createLinearGradient'] = sandbox.stub());

  context2d.createLinearGradient(0, 1, 2, 3);
  t.true(implStub.withArgs(0, 1, 2, 3).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3).calledOnce);
  });
});

// describe createRadialGradient
test('context calls createRadialGradient', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['createRadialGradient'] = sandbox.stub());
  context2d.createRadialGradient(1, 2, 3, 4, 5, 6);
  t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
});

test('context only calls upgraded createRadialGradient if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['createRadialGradient'] = sandbox.stub());
  const implStub = (implementation['createRadialGradient'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.createRadialGradient(1, 2, 3, 4, 5, 6);
    t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of createRadialGradient when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['createRadialGradient'] = sandbox.stub());
  const implStub = (implementation['createRadialGradient'] = sandbox.stub());

  context2d.createRadialGradient(0, 1, 2, 3, 4, 5);
  t.true(implStub.withArgs(0, 1, 2, 3, 4, 5).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3, 4, 5).calledOnce);
  });
});

// describe createPattern
test('context calls createPattern', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['createPattern'] = sandbox.stub());

  const imageBitmap = {} as ImageBitmap;
  context2d.createPattern(imageBitmap, 'repeat');
  t.true(stub.withArgs(imageBitmap, 'repeat').calledOnce);
});

test('context only calls upgraded createPattern if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['createPattern'] = sandbox.stub());
  const implStub = (implementation['createPattern'] = sandbox.stub());
  const imageBitmap = {} as ImageBitmap;

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.createPattern(imageBitmap, 'repeat');
    t.true(stub.withArgs(imageBitmap, 'repeat').calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of createPattern when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['createPattern'] = sandbox.stub());
  const implStub = (implementation['createPattern'] = sandbox.stub());
  const imageBitmap = {} as ImageBitmap;

  context2d.createPattern(imageBitmap, 'repeat');
  t.true(implStub.withArgs(imageBitmap, 'repeat').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(imageBitmap, 'repeat').calledOnce);
  });
});

// describe shadowBlur
test('context calls set shadowBlur', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'shadowBlur', spy);
  context2d.shadowBlur = 200;
  t.true(spy.withArgs(200).calledOnce);
});

test('context calls get shadowBlur', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'shadowBlur', spy);
  context2d.shadowBlur;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set shadowBlur if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'shadowBlur', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'shadowBlur', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.shadowBlur = 500;
    t.true(spy.withArgs(500).calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get shadowBlur if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'shadowBlur', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'shadowBlur', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.shadowBlur;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set shadowBlur when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'shadowBlur', instanceSpy);
  createSetterStub(sandbox, implementation, 'shadowBlur', implSpy);

  context2d.shadowBlur = 300;
  t.true(implSpy.withArgs(300).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs(300).calledOnce);
  });
});

// describe shadowColor
test('context calls set shadowColor', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'shadowColor', spy);
  context2d.shadowColor = 'green';
  t.true(spy.withArgs('green').calledOnce);
});

test('context calls get shadowColor', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'shadowColor', spy);
  context2d.shadowColor;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set shadowColor if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'shadowColor', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'shadowColor', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.shadowColor = 'red';
    t.true(spy.withArgs('red').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get shadowColor if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'shadowColor', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'shadowColor', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.shadowColor;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set shadowColor when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'shadowColor', instanceSpy);
  createSetterStub(sandbox, implementation, 'shadowColor', implSpy);

  context2d.shadowColor = 'blue';
  t.true(implSpy.withArgs('blue').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('blue').calledOnce);
  });
});

// describe shadowOffsetX
test('context calls set shadowOffsetX', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'shadowOffsetX', spy);
  context2d.shadowOffsetX = 250;
  t.true(spy.withArgs(250).calledOnce);
});

test('context calls get shadowOffsetX', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'shadowOffsetX', spy);
  context2d.shadowOffsetX;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set shadowOffsetX if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'shadowOffsetX', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'shadowOffsetX', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.shadowOffsetX = 200;
    t.true(spy.withArgs(200).calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get shadowOffsetX if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'shadowOffsetX', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'shadowOffsetX', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.shadowOffsetX;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set shadowOffsetX when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'shadowOffsetX', instanceSpy);
  createSetterStub(sandbox, implementation, 'shadowOffsetX', implSpy);

  context2d.shadowOffsetX = 20;
  t.true(implSpy.withArgs(20).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs(20).calledOnce);
  });
});

// describe shadowOffsetY
test('context calls set shadowOffsetY', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'shadowOffsetY', spy);
  context2d.shadowOffsetY = 300;
  t.true(spy.withArgs(300).calledOnce);
});

test('context calls get shadowOffsetY', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'shadowOffsetY', spy);
  context2d.shadowOffsetY;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set shadowOffsetY if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'shadowOffsetY', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'shadowOffsetY', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.shadowOffsetY = 200;
    t.true(spy.withArgs(200).calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get shadowOffsetY if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'shadowOffsetY', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'shadowOffsetY', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.shadowOffsetY;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set shadowOffsetY when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'shadowOffsetY', instanceSpy);
  createSetterStub(sandbox, implementation, 'shadowOffsetY', implSpy);

  context2d.shadowOffsetY = 20;
  t.true(implSpy.withArgs(20).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs(20).calledOnce);
  });
});

// describe beginPath
test('context calls beginPath', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['beginPath'] = sandbox.stub());
  context2d.beginPath();
  t.true(stub.calledOnce);
});

test('context only calls upgraded beginPath if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['beginPath'] = sandbox.stub());
  const implStub = (implementation['beginPath'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.beginPath();
    t.true(stub.calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of beginPath when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['beginPath'] = sandbox.stub());
  const implStub = (implementation['beginPath'] = sandbox.stub());

  context2d.beginPath();
  t.true(implStub.calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.calledOnce);
  });
});

// describe closePath
test('context calls closePath', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['closePath'] = sandbox.stub());
  context2d.closePath();
  t.true(stub.withArgs().calledOnce);
});

test('context only calls upgraded closePath if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['closePath'] = sandbox.stub());
  const implStub = (implementation['closePath'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.closePath();
    t.true(stub.calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of closePath when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['closePath'] = sandbox.stub());
  const implStub = (implementation['closePath'] = sandbox.stub());

  context2d.closePath();
  t.true(implStub.calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.calledOnce);
  });
});

// describe moveTo
test('context calls moveTo', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['moveTo'] = sandbox.stub());
  context2d.moveTo(1, 1);
  t.true(stub.withArgs(1, 1).calledOnce);
});

test('context only calls upgraded moveTo if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['moveTo'] = sandbox.stub());
  const implStub = (implementation['moveTo'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.moveTo(1, 2);
    t.true(stub.withArgs(1, 2).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of moveTo when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['moveTo'] = sandbox.stub());
  const implStub = (implementation['moveTo'] = sandbox.stub());

  context2d.moveTo(0, 1);
  t.true(implStub.withArgs(0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1).calledOnce);
  });
});

// describe lineTo
test('context calls lineTo', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['lineTo'] = sandbox.stub());
  context2d.lineTo(1, 1);
  t.true(stub.withArgs(1, 1).calledOnce);
});

test('context only calls upgraded lineTo if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['lineTo'] = sandbox.stub());
  const implStub = (implementation['lineTo'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.lineTo(1, 2);
    t.true(stub.withArgs(1, 2).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of lineTo when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['lineTo'] = sandbox.stub());
  const implStub = (implementation['lineTo'] = sandbox.stub());

  context2d.lineTo(0, 1);
  t.true(implStub.withArgs(0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1).calledOnce);
  });
});

// describe bezierCurveTo
test('context calls bezierCurveTo', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['bezierCurveTo'] = sandbox.stub());
  context2d.bezierCurveTo(1, 2, 3, 4, 5, 6);
  t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
});

test('context only calls upgraded bezierCurveTo if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['bezierCurveTo'] = sandbox.stub());
  const implStub = (implementation['bezierCurveTo'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.bezierCurveTo(6, 5, 4, 3, 2, 1);
    t.true(stub.withArgs(6, 5, 4, 3, 2, 1).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of bezierCurveTo when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['bezierCurveTo'] = sandbox.stub());
  const implStub = (implementation['bezierCurveTo'] = sandbox.stub());

  context2d.bezierCurveTo(0, 1, 2, 3, 4, 5);
  t.true(implStub.withArgs(0, 1, 2, 3, 4, 5).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3, 4, 5).calledOnce);
  });
});

// describe quadraticCurveTo
test('context calls quadraticCurveTo', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['quadraticCurveTo'] = sandbox.stub());
  context2d.quadraticCurveTo(1, 2, 3, 4);
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('context only calls upgraded quadraticCurveTo if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['quadraticCurveTo'] = sandbox.stub());
  const implStub = (implementation['quadraticCurveTo'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.quadraticCurveTo(6, 5, 4, 3);
    t.true(stub.withArgs(6, 5, 4, 3).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of quadraticCurveTo when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['quadraticCurveTo'] = sandbox.stub());
  const implStub = (implementation['quadraticCurveTo'] = sandbox.stub());

  context2d.quadraticCurveTo(0, 1, 2, 3);
  t.true(implStub.withArgs(0, 1, 2, 3).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3).calledOnce);
  });
});

// describe arc
test('context calls arc', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['arc'] = sandbox.stub());
  context2d.arc(1, 2, 3, 4, 5);
  t.true(stub.withArgs(1, 2, 3, 4, 5).calledOnce);
});

test('context only calls upgraded arc if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['arc'] = sandbox.stub());
  const implStub = (implementation['arc'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.arc(6, 5, 4, 3, 2);
    t.true(stub.withArgs(6, 5, 4, 3, 2).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of arc when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['arc'] = sandbox.stub());
  const implStub = (implementation['arc'] = sandbox.stub());

  context2d.arc(0, 1, 2, 3, 4);
  t.true(implStub.withArgs(0, 1, 2, 3, 4).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3, 4).calledOnce);
  });
});

// describe arcTo
test('context calls arcTo', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['arcTo'] = sandbox.stub());
  context2d.arcTo(1, 2, 3, 4, 5);
  t.true(stub.withArgs(1, 2, 3, 4, 5).calledOnce);
});

test('context only calls upgraded arcTo if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['arcTo'] = sandbox.stub());
  const implStub = (implementation['arcTo'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.arcTo(6, 5, 4, 3, 2);
    t.true(stub.withArgs(6, 5, 4, 3, 2).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of arcTo when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['arcTo'] = sandbox.stub());
  const implStub = (implementation['arcTo'] = sandbox.stub());

  context2d.arcTo(0, 1, 2, 3, 4);
  t.true(implStub.withArgs(0, 1, 2, 3, 4).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3, 4).calledOnce);
  });
});

// describe ellipse
test('context calls ellipse', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['ellipse'] = sandbox.stub());
  context2d.ellipse(1, 2, 3, 4, 5, 6, 7);
  t.true(stub.withArgs(1, 2, 3, 4, 5, 6, 7).calledOnce);
});

test('context only calls upgraded ellipse if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['ellipse'] = sandbox.stub());
  const implStub = (implementation['ellipse'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.ellipse(7, 6, 5, 4, 3, 2, 1);
    t.true(stub.withArgs(7, 6, 5, 4, 3, 2, 1).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of ellipse when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['ellipse'] = sandbox.stub());
  const implStub = (implementation['ellipse'] = sandbox.stub());

  context2d.ellipse(0, 1, 2, 3, 4, 5, 6);
  t.true(implStub.withArgs(0, 1, 2, 3, 4, 5, 6).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3, 4, 5, 6).calledOnce);
  });
});

// describe rect
test('context calls rect', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['rect'] = sandbox.stub());
  context2d.rect(1, 2, 3, 4);
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('context only calls upgraded rect if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['rect'] = sandbox.stub());
  const implStub = (implementation['rect'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.rect(4, 3, 2, 1);
    t.true(stub.withArgs(4, 3, 2, 1).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of rect when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['rect'] = sandbox.stub());
  const implStub = (implementation['rect'] = sandbox.stub());

  context2d.rect(0, 1, 2, 3);
  t.true(implStub.withArgs(0, 1, 2, 3).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3).calledOnce);
  });
});

// this method has multiple signatures, test all??
// describe fill
test('context calls fill', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['fill'] as sinon.SinonStub) = sandbox.stub());
  context2d.fill('nonzero');
  t.true(stub.withArgs('nonzero').calledOnce);
});

test('context only calls upgraded fill if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['fill'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['fill'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.fill('evenodd');
    t.true(stub.withArgs('evenodd').calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of fill when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['fill'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['fill'] as sinon.SinonStub) = sandbox.stub());

  context2d.fill('nonzero');
  t.true(implStub.withArgs('nonzero').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs('nonzero').calledOnce);
  });
});

// describe stroke
test('context calls stroke', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['stroke'] as sinon.SinonStub) = sandbox.stub());
  context2d.stroke();
  t.true(stub.withArgs().calledOnce);
});

test('context only calls upgraded stroke if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['stroke'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['stroke'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.stroke();
    t.true(stub.calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of stroke when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['stroke'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['stroke'] as sinon.SinonStub) = sandbox.stub());

  context2d.stroke();
  t.true(implStub.calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.calledOnce);
  });
});

// describe clip
test('context calls clip', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['clip'] as sinon.SinonStub) = sandbox.stub());
  context2d.clip();
  t.true(stub.calledOnce);
});

test('context only calls upgraded clip if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['clip'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['clip'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.clip();
    t.true(stub.calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of clip when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['clip'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['clip'] as sinon.SinonStub) = sandbox.stub());

  context2d.clip();
  t.true(implStub.calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.calledOnce);
  });
});

// describe isPointInPath
test('context calls isPointInPath', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['isPointInPath'] as sinon.SinonStub) = sandbox.stub());
  context2d.isPointInPath(1, 2);
  t.true(stub.withArgs(1, 2).calledOnce);
});

test('context only calls upgraded isPointInPath if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['isPointInPath'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['isPointInPath'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.isPointInPath(2, 1);
    t.true(stub.withArgs(2, 1).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of isPointInPath when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['isPointInPath'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['isPointInPath'] as sinon.SinonStub) = sandbox.stub());

  context2d.isPointInPath(0, 1);
  t.true(implStub.withArgs(0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1).calledOnce);
  });
});

// describe isPointInStroke
test('context calls isPointInStroke', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['isPointInStroke'] as sinon.SinonStub) = sandbox.stub());
  context2d.isPointInStroke(1, 2);
  t.true(stub.withArgs(1, 2).calledOnce);
});

test('context only calls upgraded isPointInStroke if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['isPointInStroke'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['isPointInStroke'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.isPointInStroke(2, 1);
    t.true(stub.withArgs(2, 1).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of isPointInStroke when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['isPointInStroke'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['isPointInStroke'] as sinon.SinonStub) = sandbox.stub());

  context2d.isPointInStroke(0, 1);
  t.true(implStub.withArgs(0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1).calledOnce);
  });
});

// describe rotate
test('context calls rotate', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['rotate'] = sandbox.stub());
  context2d.rotate(6);
  t.true(stub.withArgs(6).calledOnce);
});

test('context only calls upgraded rotate if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['rotate'] = sandbox.stub());
  const implStub = (implementation['rotate'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.rotate(12);
    t.true(stub.withArgs(12).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of rotate when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['rotate'] = sandbox.stub());
  const implStub = (implementation['rotate'] = sandbox.stub());

  context2d.rotate(21);
  t.true(implStub.withArgs(21).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(21).calledOnce);
  });
});

// describe scale
test('context calls scale', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['scale'] = sandbox.stub());
  context2d.scale(10, 10);
  t.true(stub.withArgs(10, 10).calledOnce);
});

test('context only calls upgraded scale if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['scale'] = sandbox.stub());
  const implStub = (implementation['scale'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.scale(12, 12);
    t.true(stub.withArgs(12, 12).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of scale when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['scale'] = sandbox.stub());
  const implStub = (implementation['scale'] = sandbox.stub());

  context2d.scale(0, 1);
  t.true(implStub.withArgs(0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1).calledOnce);
  });
});

// describe translate
test('context calls translate', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['translate'] = sandbox.stub());
  context2d.translate(15, 15);
  t.true(stub.withArgs(15, 15).calledOnce);
});

test('context only calls upgraded translate if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['translate'] = sandbox.stub());
  const implStub = (implementation['translate'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.translate(12, 12);
    t.true(stub.withArgs(12, 12).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of translate when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['translate'] = sandbox.stub());
  const implStub = (implementation['translate'] = sandbox.stub());

  context2d.translate(0, 1);
  t.true(implStub.withArgs(0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1).calledOnce);
  });
});

// describe transform
test('context calls transform', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['transform'] = sandbox.stub());
  context2d.transform(1, 2, 3, 4, 5, 6);
  t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
});

test('context only calls upgraded transform if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['transform'] = sandbox.stub());
  const implStub = (implementation['transform'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.transform(1, 1, 1, 1, 1, 1);
    t.true(stub.withArgs(1, 1, 1, 1, 1, 1).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of transform when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['transform'] = sandbox.stub());
  const implStub = (implementation['transform'] = sandbox.stub());

  context2d.transform(0, 1, 0, 1, 0, 1);
  t.true(implStub.withArgs(0, 1, 0, 1, 0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 0, 1, 0, 1).calledOnce);
  });
});

// describe setTransform
test('context calls setTransform', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['setTransform'] as sinon.SinonStub) = sandbox.stub());
  context2d.setTransform(1, 2, 3, 4, 5, 6);
  t.true(stub.withArgs(1, 2, 3, 4, 5, 6).calledOnce);
});

test('context only calls upgraded setTransform if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['setTransform'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['setTransform'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.setTransform(2, 2, 2, 2, 2, 2);
    t.true(stub.withArgs(2, 2, 2, 2, 2, 2).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of setTransform when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['setTransform'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['setTransform'] as sinon.SinonStub) = sandbox.stub());

  context2d.setTransform(0, 1, 0, 1, 0, 1);
  t.true(implStub.withArgs(0, 1, 0, 1, 0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 0, 1, 0, 1).calledOnce);
  });
});

// describe globalAlpha
test('context calls set globalAlpha', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'globalAlpha', spy);
  context2d.globalAlpha = 300;
  t.true(spy.withArgs(300).calledOnce);
});

test('context calls get globalAlpha', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'globalAlpha', spy);
  context2d.globalAlpha;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set globalAlpha if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'globalAlpha', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'globalAlpha', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.globalAlpha = 200;
    t.true(spy.withArgs(200).calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get globalAlpha if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'globalAlpha', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'globalAlpha', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.globalAlpha;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set globalAlpha when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'globalAlpha', instanceSpy);
  createSetterStub(sandbox, implementation, 'globalAlpha', implSpy);

  context2d.globalAlpha = 20;
  t.true(implSpy.withArgs(20).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs(20).calledOnce);
  });
});

// describe globalCompositeOperation
test('context calls set globalCompositeOperation', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'globalCompositeOperation', spy);
  context2d.globalCompositeOperation = 'source-over';
  t.true(spy.withArgs('source-over').calledOnce);
});

test('context calls get globalCompositeOperation', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'globalCompositeOperation', spy);
  context2d.globalCompositeOperation;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set globalCompositeOperation if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'globalCompositeOperation', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'globalCompositeOperation', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.globalCompositeOperation = 'source-out';
    t.true(spy.withArgs('source-out').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get globalCompositeOperation if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'globalCompositeOperation', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'globalCompositeOperation', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.globalCompositeOperation;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set globalCompositeOperation when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'globalCompositeOperation', instanceSpy);
  createSetterStub(sandbox, implementation, 'globalCompositeOperation', implSpy);

  context2d.globalCompositeOperation = 'source-in';
  t.true(implSpy.withArgs('source-in').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('source-in').calledOnce);
  });
});

// describe drawImage
test('context calls drawImage', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['drawImage'] as sinon.SinonStub) = sandbox.stub());

  const imageBitmap = {} as ImageBitmap;

  context2d.drawImage(imageBitmap, 10, 10);
  t.true(stub.withArgs(imageBitmap, 10, 10).calledOnce);
});

test('context only calls upgraded drawImage if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['drawImage'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['drawImage'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);
  const imageBitmap = {} as ImageBitmap;

  await context2d.goodOffscreenPromise.then(() => {
    context2d.drawImage(imageBitmap, 200, 100);
    t.true(stub.withArgs(imageBitmap, 200, 100).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of drawImage when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['drawImage'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['drawImage'] as sinon.SinonStub) = sandbox.stub());
  const imageBitmap = {} as ImageBitmap;

  context2d.drawImage(imageBitmap, 0, 1);
  t.true(implStub.withArgs(imageBitmap, 0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(imageBitmap, 0, 1).calledOnce);
  });
});

// describe createImageData
test('context calls createImageData', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['createImageData'] as sinon.SinonStub) = sandbox.stub());
  context2d.createImageData(100, 200);
  t.true(stub.withArgs(100, 200).calledOnce);
});

test('context only calls upgraded createImageData if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['createImageData'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['createImageData'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.createImageData(200, 100);
    t.true(stub.withArgs(200, 100).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of createImageData when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['createImageData'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['createImageData'] as sinon.SinonStub) = sandbox.stub());

  context2d.createImageData(0, 1);
  t.true(implStub.withArgs(0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1).calledOnce);
  });
});

// describe getImageData
test('context calls getImageData', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['getImageData'] = sandbox.stub());
  context2d.getImageData(1, 2, 3, 4);
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('context only calls upgraded getImageData if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['getImageData'] = sandbox.stub());
  const implStub = (implementation['getImageData'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.getImageData(4, 3, 2, 1);
    t.true(stub.withArgs(4, 3, 2, 1).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of getImageData when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['getImageData'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['getImageData'] as sinon.SinonStub) = sandbox.stub());

  context2d.getImageData(0, 1, 2, 3);
  t.true(implStub.withArgs(0, 1, 2, 3).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(0, 1, 2, 3).calledOnce);
  });
});

// describe putImageData
test('context calls putImageData', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = ((implementation['putImageData'] as sinon.SinonStub) = sandbox.stub());
  const imageData = {} as ImageData;

  context2d.putImageData(imageData, 10, 10);
  t.true(stub.withArgs(imageData, 10, 10).calledOnce);
});

test('context only calls upgraded putImageData if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = ((instance.getContext('2d')['putImageData'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['putImageData'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(instance);
  const imageData = {} as ImageData;

  await context2d.goodOffscreenPromise.then(() => {
    context2d.putImageData(imageData, 200, 100);
    t.true(stub.withArgs(imageData, 200, 100).calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of putImageData when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = ((instance.getContext('2d')['putImageData'] as sinon.SinonStub) = sandbox.stub());
  const implStub = ((implementation['putImageData'] as sinon.SinonStub) = sandbox.stub());
  const imageData = {} as ImageData;

  context2d.putImageData(imageData, 0, 1);
  t.true(implStub.withArgs(imageData, 0, 1).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.withArgs(imageData, 0, 1).calledOnce);
  });
});

// describe imageSmoothingEnabled
test('context calls set imageSmoothingEnabled', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'imageSmoothingEnabled', spy);
  context2d.imageSmoothingEnabled = true;
  t.true(spy.withArgs(true).calledOnce);
});

test('context calls get imageSmoothingEnabled', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'imageSmoothingEnabled', spy);
  context2d.imageSmoothingEnabled;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set imageSmoothingEnabled if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'imageSmoothingEnabled', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'imageSmoothingEnabled', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.imageSmoothingEnabled = false;
    t.true(spy.withArgs(false).calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get imageSmoothingEnabled if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'imageSmoothingEnabled', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'imageSmoothingEnabled', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.imageSmoothingEnabled;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set imageSmoothingEnabled when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'imageSmoothingEnabled', instanceSpy);
  createSetterStub(sandbox, implementation, 'imageSmoothingEnabled', implSpy);

  context2d.imageSmoothingEnabled = true;
  t.true(implSpy.withArgs(true).calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs(true).calledOnce);
  });
});

// describe imageSmoothingQuality
test('context calls set imageSmoothingQuality', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'imageSmoothingQuality', spy);
  context2d.imageSmoothingQuality = 'high';
  t.true(spy.withArgs('high').calledOnce);
});

test('context calls get imageSmoothingQuality', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'imageSmoothingQuality', spy);
  context2d.imageSmoothingQuality;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set imageSmoothingQuality if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'imageSmoothingQuality', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'imageSmoothingQuality', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.imageSmoothingQuality = 'medium';
    t.true(spy.withArgs('medium').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get imageSmoothingQuality if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'imageSmoothingQuality', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'imageSmoothingQuality', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.imageSmoothingQuality;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set imageSmoothingQuality when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'imageSmoothingQuality', instanceSpy);
  createSetterStub(sandbox, implementation, 'imageSmoothingQuality', implSpy);

  context2d.imageSmoothingQuality = 'low';
  t.true(implSpy.withArgs('low').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('low').calledOnce);
  });
});

// describe save
test('context calls save', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['save'] = sandbox.stub());
  context2d.save();
  t.true(stub.calledOnce);
});

test('context only calls upgraded save if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['save'] = sandbox.stub());
  const implStub = (implementation['save'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.save();
    t.true(stub.calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of save when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['save'] = sandbox.stub());
  const implStub = (implementation['save'] = sandbox.stub());

  context2d.save();
  t.true(implStub.calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.calledOnce);
  });
});

// describe restore
test('context calls restore', t => {
  const { context2d, implementation, sandbox } = t.context;
  const stub = (implementation['restore'] = sandbox.stub());
  context2d.restore();
  t.true(stub.calledOnce);
});

test('context only calls upgraded restore if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const stub = (instance.getContext('2d')['restore'] = sandbox.stub());
  const implStub = (implementation['restore'] = sandbox.stub());

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.restore();
    t.true(stub.calledOnce);
    t.false(implStub.called);
  });
});

test('context calls both versions of restore when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceStub = (instance.getContext('2d')['restore'] = sandbox.stub());
  const implStub = (implementation['restore'] = sandbox.stub());

  context2d.restore();
  t.true(implStub.calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceStub.calledOnce);
  });
});

// describe filter
test('context calls set filter', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'filter', spy);
  context2d.filter = 'none';
  t.true(spy.withArgs('none').calledOnce);
});

test('context calls get filter', t => {
  const { context2d, implementation, sandbox } = t.context;
  const spy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'filter', spy);
  context2d.filter;
  t.true(spy.calledOnce);
});

test('context only calls upgraded set filter if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createSetterStub(sandbox, instance.getContext('2d'), 'filter', spy);
  const implSpy = sandbox.spy();
  createSetterStub(sandbox, implementation, 'filter', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.filter = 'none';
    t.true(spy.withArgs('none').calledOnce);
    t.false(implSpy.called);
  });
});

test('context only calls upgraded get filter if available', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;

  const instance = new FakeOffscreenCanvas();
  const spy = sandbox.spy();
  createGetterStub(sandbox, instance.getContext('2d'), 'filter', spy);
  const implSpy = sandbox.spy();
  createGetterStub(sandbox, implementation, 'filter', implSpy);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    context2d.filter;
    t.true(spy.calledOnce);
    t.false(implSpy.called);
  });
});

test('context calls both versions of set filter when called before upgrade', async t => {
  const { context2d, deferredUpgrade, implementation, sandbox } = t.context;
  const instance = new FakeOffscreenCanvas();

  const instanceSpy = sandbox.spy();
  const implSpy = sandbox.spy();

  createSetterStub(sandbox, instance.getContext('2d'), 'filter', instanceSpy);
  createSetterStub(sandbox, implementation, 'filter', implSpy);

  context2d.filter = 'none';
  t.true(implSpy.withArgs('none').calledOnce);

  deferredUpgrade.resolve(instance);

  await context2d.goodOffscreenPromise.then(() => {
    t.true(instanceSpy.withArgs('none').calledOnce);
  });
});

function createSetterStub(sandbox: sinon.SinonSandbox, obj: any, property: string, setter: () => {}) {
  obj[property] = 'existent';
  sandbox.stub(obj, property).set(setter);
}

function createGetterStub(sandbox: sinon.SinonSandbox, obj: any, property: string, getter: () => {}) {
  obj[property] = 'existent';
  sandbox.stub(obj, property).get(getter);
}
