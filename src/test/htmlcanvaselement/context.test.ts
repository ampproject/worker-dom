/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
  deferredUpgrade: { resolve: (instance: FakeOffscreenCanvas) => void; reject: (errorMsg: string) => void; upgradePromise: Promise<void> };
  sandbox: sinon.SinonSandbox;
  unUpgradedOffscreenContext: CanvasRenderingContext2D;
}>;

class FakeOffscreenCanvas {
  // For testing convenience; this class looks different from the OffscreenCanvas spec API
  private context: CanvasRenderingContext2D;

  constructor() {
    // this.x, y
    this.context = ({} as unknown) as CanvasRenderingContext2D;
  }

  getContext(c: string): CanvasRenderingContext2D {
    return this.context;
  }
}

class ImageBitmap {
  height = 0;
  width = 0;
  close() {}
}

test.beforeEach(t => {
  const sandbox = sinon.createSandbox();

  const unUpgradedOffscreen = new FakeOffscreenCanvas();
  function OffscreenCanvas() {
    return unUpgradedOffscreen;
  }

  const document = createTestingDocument({ OffscreenCanvas, ImageBitmap });
  const canvas = document.createElement('canvas') as HTMLCanvasElement;

  t.context = {
    canvas,
    context2d: canvas.getContext('2d'),
    deferredUpgrade: deferredUpgrades.get(canvas),
    sandbox,
    unUpgradedOffscreenContext: unUpgradedOffscreen.getContext('2d'),
  };
});

test.afterEach(t => {
  const { sandbox } = t.context;
  sandbox.restore();
});

// describe clearRect
test('context calls clearRect', t => {
  const { context2d, sandbox, unUpgradedOffscreenContext } = t.context;

  // should call method in the un-upgraded version
  const stub = (unUpgradedOffscreenContext['clearRect'] = sandbox.stub());

  context2d.clearRect(1, 2, 3, 4);
  t.true(stub.withArgs(1, 2, 3, 4).calledOnce);
});

test('context only calls upgraded clearRect if available', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  // stub out method in context of un-upgraded OffscreenCanvas
  const unUpgradedStub = (unUpgradedOffscreenContext['clearRect'] = sandbox.stub());

  // this upgradedInstance will represent the upgraded OffscreenCanvas
  // stub out method for this upgradedInstance's context as well
  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedStub = (upgradedInstance.getContext('2d')['clearRect'] = sandbox.stub());

  // upgrade the context's OffscreenCanvas
  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    context2d.clearRect(1, 2, 3, 4);
    t.true(upgradedStub.withArgs(1, 2, 3, 4).calledOnce);
    t.true(unUpgradedStub.notCalled);
  });
});

test('context calls both versions of clearRect when called before upgrade', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  // stub out method in context of un-upgraded OffscreenCanvas
  const unUpgradedStub = (unUpgradedOffscreenContext['clearRect'] = sandbox.stub());

  // this upgradedInstance will represent the upgraded OffscreenCanvas
  // stub out method for this upgradedInstance's context as well
  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedStub = (upgradedInstance.getContext('2d')['clearRect'] = sandbox.stub());

  context2d.clearRect(10, 9, 8, 7);
  t.true(unUpgradedStub.withArgs(10, 9, 8, 7).calledOnce);

  // upgrade the context's OffscreenCanvas
  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    t.true(upgradedStub.withArgs(10, 9, 8, 7).calledOnce);
  });
});

// describe fillText
test('context calls fillText', t => {
  const { context2d, sandbox, unUpgradedOffscreenContext } = t.context;

  // should call method in the un-upgraded version
  const stub = (unUpgradedOffscreenContext['fillText'] = sandbox.stub());

  context2d.fillText('hello, world', 1, 2);
  t.true(stub.withArgs('hello, world', 1, 2).calledOnce);
});

test('context only calls upgraded fillText if available', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedStub = (unUpgradedOffscreenContext['fillText'] = sandbox.stub());

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedStub = (upgradedInstance.getContext('2d')['fillText'] = sandbox.stub());

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    context2d.fillText('hello, world', 1, 2);
    t.true(upgradedStub.withArgs('hello, world', 1, 2).calledOnce);
    t.true(unUpgradedStub.notCalled);
  });
});

test('context calls both versions of fillText when called before upgrade', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedStub = (unUpgradedOffscreenContext['fillText'] = sandbox.stub());

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedStub = (upgradedInstance.getContext('2d')['fillText'] = sandbox.stub());

  context2d.fillText('hello, world', 1, 2);
  t.true(unUpgradedStub.withArgs('hello, world', 1, 2).calledOnce);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    t.true(upgradedStub.withArgs('hello, world', 1, 2).calledOnce);
  });
});

// describe lineWidth
test('context calls set lineWidth', t => {
  const { context2d, sandbox, unUpgradedOffscreenContext } = t.context;
  const setter = sandbox.spy();

  // must declare property before sandbox lets us stub a setter for it
  (unUpgradedOffscreenContext['lineWidth'] as any) = 'existent';

  // should call setter in the un-upgraded version
  sandbox.stub(unUpgradedOffscreenContext, 'lineWidth').set(setter);

  context2d.lineWidth = 100;
  t.true(setter.withArgs(100).calledOnce);
});

test('context calls get lineWidth', t => {
  const { context2d, sandbox, unUpgradedOffscreenContext } = t.context;
  const getter = sandbox.spy();

  // must declare property before sandbox lets us stub a getter for it
  (unUpgradedOffscreenContext['lineWidth'] as any) = 'existent';

  // should call getter in the un-upgraded version
  sandbox.stub(unUpgradedOffscreenContext, 'lineWidth').get(getter);

  context2d.lineWidth;
  t.true(getter.calledOnce);
});

test('context only calls upgraded set lineWidth if available', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedSetter = sandbox.spy();
  (unUpgradedOffscreenContext['lineWidth'] as any) = 'existent';
  sandbox.stub(unUpgradedOffscreenContext, 'lineWidth').set(unUpgradedSetter);

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedSetter = sandbox.spy();
  (upgradedInstance.getContext('2d')['lineWidth'] as any) = 'existent';
  sandbox.stub(upgradedInstance.getContext('2d'), 'lineWidth').set(upgradedSetter);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    context2d.lineWidth = 100;
    t.true(upgradedSetter.withArgs(100).calledOnce);
    t.true(unUpgradedSetter.notCalled);
  });
});

test('context only calls upgraded get lineWidth if available', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedGetter = sandbox.spy();
  (unUpgradedOffscreenContext['lineWidth'] as any) = 'existent';
  sandbox.stub(unUpgradedOffscreenContext, 'lineWidth').get(unUpgradedGetter);

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedGetter = sandbox.spy();
  (upgradedInstance.getContext('2d')['lineWidth'] as any) = 'existent';
  sandbox.stub(upgradedInstance.getContext('2d'), 'lineWidth').get(upgradedGetter);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    context2d.lineWidth;
    t.true(upgradedGetter.calledOnce);
    t.true(unUpgradedGetter.notCalled);
  });
});

test('context calls both versions of set lineWidth when called before upgrade', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedSetter = sandbox.spy();
  (unUpgradedOffscreenContext['lineWidth'] as any) = 'existent';
  sandbox.stub(unUpgradedOffscreenContext, 'lineWidth').set(unUpgradedSetter);

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedSetter = sandbox.spy();
  (upgradedInstance.getContext('2d')['lineWidth'] as any) = 'existent';
  sandbox.stub(upgradedInstance.getContext('2d'), 'lineWidth').set(upgradedSetter);

  context2d.lineWidth = 200;
  t.true(unUpgradedSetter.withArgs(200).calledOnce);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    t.true(upgradedSetter.withArgs(200).calledOnce);
  });
});

// describe lineCap
test('context calls set lineCap', t => {
  const { context2d, sandbox, unUpgradedOffscreenContext } = t.context;

  const setter = sandbox.spy();

  (unUpgradedOffscreenContext['lineCap'] as any) = 'existent';
  sandbox.stub(unUpgradedOffscreenContext, 'lineCap').set(setter);

  context2d.lineCap = 'butt';
  t.true(setter.withArgs('butt').calledOnce);
});

test('context calls get lineCap', t => {
  const { context2d, sandbox, unUpgradedOffscreenContext } = t.context;

  const getter = sandbox.spy();

  (unUpgradedOffscreenContext['lineCap'] as any) = 'existent';
  sandbox.stub(unUpgradedOffscreenContext, 'lineCap').get(getter);

  context2d.lineCap;
  t.true(getter.calledOnce);
});

test('context only calls upgraded set lineCap if available', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedSetter = sandbox.spy();
  (unUpgradedOffscreenContext['lineCap'] as any) = 'existent';
  sandbox.stub(unUpgradedOffscreenContext, 'lineCap').set(unUpgradedSetter);

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedSetter = sandbox.spy();
  (upgradedInstance.getContext('2d')['lineCap'] as any) = 'existent';
  sandbox.stub(upgradedInstance.getContext('2d'), 'lineCap').set(upgradedSetter);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    context2d.lineCap = 'butt';
    t.true(upgradedSetter.withArgs('butt').calledOnce);
    t.true(unUpgradedSetter.notCalled);
  });
});

test('context only calls upgraded get lineCap if available', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedGetter = sandbox.spy();
  (unUpgradedOffscreenContext['lineCap'] as any) = 'existent';
  sandbox.stub(unUpgradedOffscreenContext, 'lineCap').get(unUpgradedGetter);

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedGetter = sandbox.spy();
  (upgradedInstance.getContext('2d')['lineCap'] as any) = 'existent';
  sandbox.stub(upgradedInstance.getContext('2d'), 'lineCap').get(upgradedGetter);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    context2d.lineCap;
    t.true(upgradedGetter.calledOnce);
    t.true(unUpgradedGetter.notCalled);
  });
});

test('context calls both versions of set lineCap when called before upgrade', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedSetter = sandbox.spy();
  (unUpgradedOffscreenContext['lineCap'] as any) = 'existent';
  sandbox.stub(unUpgradedOffscreenContext, 'lineCap').set(unUpgradedSetter);

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedSetter = sandbox.spy();
  (upgradedInstance.getContext('2d')['lineCap'] as any) = 'existent';
  sandbox.stub(upgradedInstance.getContext('2d'), 'lineCap').set(upgradedSetter);

  context2d.lineCap = 'round';
  t.true(unUpgradedSetter.withArgs('round').calledOnce);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    t.true(upgradedSetter.withArgs('round').calledOnce);
  });
});

// describe setLineDash
test('context calls setLineDash', t => {
  const { context2d, sandbox, unUpgradedOffscreenContext } = t.context;

  // should call method in the un-upgraded version
  const stub = (unUpgradedOffscreenContext['setLineDash'] = sandbox.stub());

  context2d.setLineDash([1, 2, 3, 4]);
  t.true(stub.withArgs([1, 2, 3, 4]).calledOnce);
});

test('context only calls upgraded setLineDash if available', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedStub = (unUpgradedOffscreenContext['setLineDash'] = sandbox.stub());

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedStub = (upgradedInstance.getContext('2d')['setLineDash'] = sandbox.stub());

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    context2d.setLineDash([1, 2, 3, 4]);
    t.true(upgradedStub.withArgs([1, 2, 3, 4]).calledOnce);
    t.true(unUpgradedStub.notCalled);
  });
});

test('context calls both versions of setLineDash when called before upgrade', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedStub = (unUpgradedOffscreenContext['setLineDash'] = sandbox.stub());

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedStub = (upgradedInstance.getContext('2d')['setLineDash'] = sandbox.stub());

  context2d.setLineDash([0, 1, 2]);
  t.true(unUpgradedStub.withArgs([0, 1, 2]).calledOnce);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    t.true(upgradedStub.withArgs([0, 1, 2]).calledOnce);
  });
});

// describe drawImage
test('context calls drawImage', t => {
  const { context2d, sandbox, unUpgradedOffscreenContext } = t.context;

  // should call method in the un-upgraded version
  const stub = ((unUpgradedOffscreenContext['drawImage'] as sinon.SinonStub) = sandbox.stub());

  // a fake object can be used as argument for testing
  const imageBitmap = new ImageBitmap();

  context2d.drawImage(imageBitmap, 10, 10);
  t.true(stub.withArgs(imageBitmap, 10, 10).calledOnce);
});

test('context only calls upgraded drawImage if available', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedStub = ((unUpgradedOffscreenContext['drawImage'] as sinon.SinonStub) = sandbox.stub());

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedStub = ((upgradedInstance.getContext('2d')['drawImage'] as sinon.SinonStub) = sandbox.stub());

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    const imageBitmap = new ImageBitmap();
    context2d.drawImage(imageBitmap, 200, 100);
    t.true(upgradedStub.withArgs(imageBitmap, 200, 100).calledOnce);
    t.true(unUpgradedStub.notCalled);
  });
});

test('context calls both versions of drawImage when called before upgrade', async t => {
  const { context2d, deferredUpgrade, sandbox, unUpgradedOffscreenContext } = t.context;

  const unUpgradedStub = ((unUpgradedOffscreenContext['drawImage'] as sinon.SinonStub) = sandbox.stub());

  const upgradedInstance = new FakeOffscreenCanvas();
  const upgradedStub = ((upgradedInstance.getContext('2d')['drawImage'] as sinon.SinonStub) = sandbox.stub());

  const imageBitmap = new ImageBitmap();

  context2d.drawImage(imageBitmap, 0, 1);
  t.true(unUpgradedStub.withArgs(imageBitmap, 0, 1).calledOnce);

  deferredUpgrade.resolve(upgradedInstance);

  await deferredUpgrade.upgradePromise.then(() => {
    t.true(upgradedStub.withArgs(imageBitmap, 0, 1).calledOnce);
  });
});
